"""
Vessel 01 turntable — built and rendered in Blender (Cycles).

Everything is procedural and derived from BRIEF.md §6:
  180 mm tall, 62 mm diameter, thick-walled borosilicate glass, brushed 316
  steel collar and weighted base, knurled quarter-turn steel cap, the
  CORNEUM wordmark laser-etched into the collar, graduations every 25 ml and
  a single etched dose line with "200 ML" beside it. Nothing else on the glass.

Fill geometry: 3 mm walls give a 56 mm bore, so 25 ml = 10.15 mm of height and
200 ml sits 81.2 mm above the floor (DATA-NOTES.md: drafting assumption).

The sequence (60 frames):
   1–36  vessel turns from −150° to 0°: the etching comes round from the back
  37–52  clear liquid fills to the 200 ML line
  53–60  cap turns a quarter-turn (90°)

The flight (--shot flight, 90 square frames, used by the home page): the
vessel travels from the hero into the pin, and on the way it tumbles.
      1  at rest, three-quarter front, standing on the floor (the hero still)
   2–36  lifts off, rolls and pitches toward the camera while turning to its
         back, then lands upright facing away
  37–66  half-turn back to the front: the etching comes round through the glass
  67–82  clear liquid fills to the 200 ML line
  83–90  cap turns a quarter-turn (90°)
Glass renders with transparent alpha so the page's type shows through it.

Run:
  blender -b -P render/vessel.py -- --frames 60 --out render/out
  blender -b -P render/vessel.py -- --frames 1-60 --out render/out --samples 192
  blender -b -P render/vessel.py -- --shot flight --frames 1-90 --out render/flight --samples 160
"""

import bpy, bmesh, math, os, sys
from mathutils import Vector

# ─── args ─────────────────────────────────────────────────────────────────
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(name, default):
    return argv[argv.index(name) + 1] if name in argv else default

FRAMES = arg("--frames", "60")
OUT = os.path.abspath(arg("--out", os.path.join(os.path.dirname(__file__), "out")))
SAMPLES = int(arg("--samples", "192"))
SHOT = arg("--shot", "turntable")      # turntable (product image) | flight (home page)
FLIGHT = SHOT == "flight"
# Flight only: render without the floor, so no shadow. The encoder blends these
# with the normal frames so the shadow fades out as the vessel lifts off.
NO_SHADOW = "--no-shadow" in argv
RES_X, RES_Y = (int(arg("--width", "2000")), int(arg("--height", "2000"))) if FLIGHT else \
               (int(arg("--width", "1600")), int(arg("--height", "2000")))
HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "fonts", "GeistMono-Medium.ttf")  # static Medium: Blender ignores variable axes

MM = 0.001

# ─── dimensions (mm) ──────────────────────────────────────────────────────
R_GLASS_OUT, WALL = 31.0, 3.0
R_BORE = R_GLASS_OUT - WALL            # 28
Z_FLOOR = 14.0                         # top of the steel base
Z_GLASS_TOP = 152.0
Z_COLLAR = (150.0, 166.0)
Z_CAP = (166.0, 180.0)
ML25 = 25000 / (math.pi * R_BORE ** 2)  # mm of height per 25 ml ≈ 10.15
Z_DOSE = Z_FLOOR + 8 * ML25            # 200 ml ≈ 95.2

# ─── scene reset ──────────────────────────────────────────────────────────
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = "METRIC"

# ─── materials ────────────────────────────────────────────────────────────
def principled(name, **inputs):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    for k, v in inputs.items():
        b.inputs[k].default_value = v
    return m, b

glass, _ = principled("Borosilicate", **{"Base Color": (1, 1, 1, 1), "Transmission Weight": 1.0,
                                          "Roughness": 0.0, "IOR": 1.47})
# Etching reads as a matte grey frosting: rough, and with little specular so a
# strip light's highlight can't wash the letters out
etch, _ = principled("Etch", **{"Base Color": (0.30, 0.30, 0.30, 1), "Transmission Weight": 0.0,
                                "Roughness": 0.85, "Specular IOR Level": 0.15, "IOR": 1.47})
water, _ = principled("Liquid", **{"Base Color": (1, 1, 1, 1), "Transmission Weight": 1.0,
                                   "Roughness": 0.0, "IOR": 1.34})

def brushed_steel(name, rough=0.26):
    m, b = principled(name, **{"Base Color": (0.78, 0.78, 0.79, 1), "Metallic": 1.0,
                               "Roughness": rough, "Anisotropic": 0.75})
    nt = m.node_tree
    tan = nt.nodes.new("ShaderNodeTangent")
    tan.direction_type = "RADIAL"
    tan.axis = "Z"                      # brushed around the circumference
    nt.links.new(tan.outputs["Tangent"], b.inputs["Tangent"])
    # fine horizontal brushing: noise stretched along the circumference
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (40, 40, 4000)
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 1.0
    noise.inputs["Detail"].default_value = 2.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], noise.inputs["Vector"])
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m

steel = brushed_steel("Brushed 316")
laser, _ = principled("Laser etch", **{"Base Color": (0.35, 0.35, 0.36, 1), "Metallic": 0.6, "Roughness": 0.7})

def knurled_steel():
    """Diamond knurl as a bump: two diagonal sine gratings in (arc length, z)."""
    m = brushed_steel("Knurled", rough=0.3)
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sep.inputs["Vector"])
    ang = nt.nodes.new("ShaderNodeMath"); ang.operation = "ARCTAN2"
    nt.links.new(sep.outputs["Y"], ang.inputs[0]); nt.links.new(sep.outputs["X"], ang.inputs[1])
    arc = nt.nodes.new("ShaderNodeMath"); arc.operation = "MULTIPLY"; arc.inputs[1].default_value = R_GLASS_OUT * MM
    nt.links.new(ang.outputs[0], arc.inputs[0])
    freq = 2 * math.pi / (1.1 * MM)     # ~1.1 mm pitch
    def grating(sign):
        s = nt.nodes.new("ShaderNodeMath"); s.operation = "ADD" if sign > 0 else "SUBTRACT"
        nt.links.new(arc.outputs[0], s.inputs[0]); nt.links.new(sep.outputs["Z"], s.inputs[1])
        f = nt.nodes.new("ShaderNodeMath"); f.operation = "MULTIPLY"; f.inputs[1].default_value = freq
        nt.links.new(s.outputs[0], f.inputs[0])
        sn = nt.nodes.new("ShaderNodeMath"); sn.operation = "SINE"
        nt.links.new(f.outputs[0], sn.inputs[0])
        return sn
    g1, g2 = grating(1), grating(-1)
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MINIMUM"
    nt.links.new(g1.outputs[0], mul.inputs[0]); nt.links.new(g2.outputs[0], mul.inputs[1])
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.9
    bump.inputs["Distance"].default_value = 0.0004
    nt.links.new(mul.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m

knurl = knurled_steel()

# ─── geometry helpers ─────────────────────────────────────────────────────
def link(obj, parent=None):
    scene.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj

def lathe(name, profile, mat, segs=256, parent=None):
    """Revolve a (radius, z) profile in mm around Z."""
    bm = bmesh.new()
    rings = []
    for (r, z) in profile:
        ring = [bm.verts.new((r * MM * math.cos(2 * math.pi * i / segs),
                              r * MM * math.sin(2 * math.pi * i / segs), z * MM)) for i in range(segs)]
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for i in range(segs):
            j = (i + 1) % segs
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)   # glass must face outward to refract correctly
    # Split hard edges (lips, bevels over 30°). Otherwise smooth shading blends a
    # 140 mm wall's normal with the lips at each end, tilting it vertically and
    # turning a straight tube into a lens.
    sharp = [e for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle() > math.radians(30)]
    bmesh.ops.split_edges(bm, edges=sharp)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new(name, me)
    obj.data.materials.append(mat)
    return link(obj, parent)

def disc(name, r, z, mat, segs=256, parent=None, flip=False):
    bm = bmesh.new()
    c = bm.verts.new((0, 0, z * MM))
    ring = [bm.verts.new((r * MM * math.cos(2 * math.pi * i / segs), r * MM * math.sin(2 * math.pi * i / segs), z * MM))
            for i in range(segs)]
    for i in range(segs):
        f = (c, ring[i], ring[(i + 1) % segs])
        bm.faces.new(f[::-1] if flip else f)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new(name, me); obj.data.materials.append(mat)
    return link(obj, parent)

def wrap(me, radius_mm, angle0=0.0):
    """Wrap flat geometry (x across, y up, z out, all mm-scaled metres) onto a
    cylinder of the given radius, centred on the front (facing −Y)."""
    R = radius_mm * MM
    for v in me.vertices:
        x, y, z = v.co
        th = angle0 + x / R
        r = R + z
        v.co = Vector((r * math.sin(th), -r * math.cos(th), y))

def strip(name, x0, x1, zc, h, radius, mat, depth=0.08, parent=None):
    """An etched band from x0..x1 (mm, arc length) at height zc, wrapped."""
    bm = bmesh.new()
    steps = max(2, int(abs(x1 - x0) / 0.5))
    verts = []
    for k in range(steps + 1):
        x = (x0 + (x1 - x0) * k / steps) * MM
        verts.append([bm.verts.new((x, (zc + dz) * MM, dd * MM)) for dz in (-h / 2, h / 2) for dd in (0, depth)])
    for a, b in zip(verts, verts[1:]):
        # outer face, top, bottom
        bm.faces.new((a[1], b[1], b[3], a[3]))
        bm.faces.new((a[2], a[3], b[3], b[2]))
        bm.faces.new((a[0], b[0], b[1], a[1]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    wrap(me, radius)
    obj = bpy.data.objects.new(name, me); obj.data.materials.append(mat)
    return link(obj, parent)

def text(name, body, size_mm, x_mm, zc_mm, radius, mat, align="LEFT", depth=0.08, parent=None):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.font = bpy.data.fonts.load(FONT)
    cu.size = size_mm * MM
    cu.align_x = align
    cu.align_y = "CENTER"
    cu.extrude = depth * MM / 2
    tmp = bpy.data.objects.new(name + "_tmp", cu)
    scene.collection.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp)
    for v in me.vertices:                # curve space: x across, y up, z out
        v.co = Vector((v.co.x + x_mm * MM, v.co.y + zc_mm * MM, v.co.z + depth * MM / 2))
    wrap(me, radius)
    obj = bpy.data.objects.new(name, me); obj.data.materials.append(mat)
    return link(obj, parent)

# ─── the vessel ───────────────────────────────────────────────────────────
vessel = bpy.data.objects.new("Vessel01", None)
scene.collection.objects.link(vessel)

# Flight: the vessel hangs from a pivot at mid-height, so it tumbles about its
# centre rather than its base. The pivot turns in ZXY order: first the vessel's
# own axis (yaw), then a pitch toward the camera, then a roll in the picture.
Z_MID = 0.090
pivot = None
if FLIGHT:
    pivot = bpy.data.objects.new("Pivot", None)
    scene.collection.objects.link(pivot)
    pivot.rotation_mode = "ZXY"
    vessel.parent = pivot
    vessel.location = (0, 0, -Z_MID)

# Glass: closed thick-walled tube (outer wall, inner wall, top and bottom lips)
lathe("Glass", [(R_BORE, 12.5), (R_GLASS_OUT, 12.5), (R_GLASS_OUT, Z_GLASS_TOP), (R_BORE, Z_GLASS_TOP), (R_BORE, 12.5)],
      glass, parent=vessel)

# Weighted base: flange, body, shallow machined recess underneath
lathe("Base", [(0.1, 0.4), (27.0, 0.4), (27.0, 1.2), (33.2, 1.2), (34.0, 2.0), (34.0, 3.6), (32.2, 4.4),
               (32.2, Z_FLOOR - 0.6), (31.6, Z_FLOOR), (R_BORE, Z_FLOOR), (0.1, Z_FLOOR)], steel, parent=vessel)

# Collar
lathe("Collar", [(R_BORE + 0.5, Z_COLLAR[0]), (32.0, Z_COLLAR[0]), (32.5, Z_COLLAR[0] + 0.5), (32.5, Z_COLLAR[1] - 0.5),
                 (32.0, Z_COLLAR[1]), (29.5, Z_COLLAR[1])], steel, parent=vessel)
text("Wordmark", "CORNEUM", 4.2, 0.0, (Z_COLLAR[0] + Z_COLLAR[1]) / 2, 32.5 - 0.03, laser, align="CENTER",
     depth=0.06, parent=vessel)

# Cap (its own pivot so it can turn)
cap = bpy.data.objects.new("Cap", None)
link(cap, vessel)
lathe("CapSide", [(30.0, Z_CAP[0]), (31.4, Z_CAP[0] + 0.4), (31.4, Z_CAP[1] - 0.8), (30.6, Z_CAP[1])], knurl, parent=cap)
disc("CapTop", 30.6, Z_CAP[1], steel, parent=cap)
# The cap seals the bore: a steel face under the collar closes the top, so no
# ray can escape up the open tube (it would read as a bright bar in the glass)
disc("Seal", R_BORE + 0.6, Z_COLLAR[0] + 1.0, steel, parent=vessel, flip=True)

# Etching, front-facing at 0°: seven graduations and the 200 ML dose line
R_ETCH = R_GLASS_OUT + 0.05          # clear of the glass surface: no z-fighting
for k in range(1, 8):
    z = Z_FLOOR + k * ML25
    strip(f"Tick{k}", -10.0, -4.0 if k % 2 else -6.5, z, 0.6, R_ETCH, etch, parent=vessel)
strip("DoseLine", -10.0, 9.0, Z_DOSE, 0.65, R_ETCH, etch, parent=vessel)
text("DoseLabel", "200 ML", 5.0, 11.0, Z_DOSE, R_ETCH, etch, parent=vessel)

# Liquid: a separate cylinder whose height scales from 0 to the dose line
liquid = lathe("Liquid", [(0.1, Z_FLOOR + 0.05), (R_BORE - 0.05, Z_FLOOR + 0.05), (R_BORE - 0.05, Z_DOSE - 0.6),
                          (R_BORE - 0.6, Z_DOSE), (0.1, Z_DOSE)], water, parent=vessel)
liquid_origin_z = (Z_FLOOR + 0.05) * MM

# ─── studio ───────────────────────────────────────────────────────────────
# Shadow catcher floor: pure white background is composited later, so the
# only thing kept from the floor is the hard shadow.
bpy.ops.mesh.primitive_plane_add(size=2.0, location=(0, 0, 0))
floor = bpy.context.active_object
floor.is_shadow_catcher = True
# The floor only exists to catch the shadow. If refracted rays can see it, its
# horizon line bends through the glass into a false shape inside the vessel.
floor.visible_transmission = False
floor.visible_glossy = False
floor.visible_diffuse = False
floor.hide_render = NO_SHADOW
if FLIGHT:
    floor.scale = (0.25, 0.25, 1)      # 0.5 m: its far edges fell in frame as grey smudges

world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.5, 0.5, 0.5, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.09

# White seamless card behind the vessel: what the glass shows through, the way
# a real product shoot works. Invisible to the camera (the page supplies the
# white) and casts nothing.
bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0, 0.32, 0.16), rotation=(math.pi / 2, 0, 0))
card = bpy.context.active_object
card.scale = (0.42, 0.6, 1)          # just wider than the glass: steel sides reflect the flags, not white
cm = bpy.data.materials.new("Card"); cm.use_nodes = True
nt = cm.node_tree; nt.nodes.remove(nt.nodes["Principled BSDF"])
em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Strength"].default_value = 1.0
nt.links.new(em.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
card.data.materials.append(cm)
card.visible_camera = False
card.visible_shadow = False
# Flight: through the glass you see the page, not the card. The card is still
# reflected (it gives the glass and steel their highlights), but refracted rays
# pass to the transparent background.
if FLIGHT:
    card.visible_transmission = False

def area(name, loc, target, size, energy, shape="SQUARE", size_y=None, glossy=True, shadow=True):
    li = bpy.data.lights.new(name, "AREA")
    li.shape = shape
    li.size = size
    if size_y:
        li.size_y = size_y
    li.energy = energy
    ob = bpy.data.objects.new(name, li)
    scene.collection.objects.link(ob)
    ob.location = loc
    d = Vector(target) - Vector(loc)
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    ob.visible_glossy = glossy
    ob.visible_transmission = False     # lights never smear through the glass
    li.use_shadow = shadow
    return ob

# Key: small, hard, upper left and slightly behind: shadow falls lower right
area("Key", (-0.40, 0.26, 1.30), (0, 0, 0.08), 0.025, 75.0, glossy=False)  # high: a short shadow that ends in frame
# Two tall strip boxes give the glass and steel their vertical highlights
area("StripL", (-0.26, 0.02, 0.1), (0, 0, 0.09), 0.03, 5.0, "RECTANGLE", 1.2, shadow=False)
area("StripR", (0.26, 0.04, 0.1), (0, 0, 0.09), 0.03, 3.0, "RECTANGLE", 1.2, shadow=False)
# soft front fill, no shadow, so the steel has body
area("Fill", (0.0, -0.8, 0.35), (0, 0, 0.09), 0.6, 2.5, shadow=False, glossy=True)

# Black flags left and right, invisible to the camera, so the glass edges read
def flag(name, x):
    bpy.ops.mesh.primitive_plane_add(size=0.7, location=(x, 0.02, 0.12), rotation=(0, math.pi / 2, 0))
    f = bpy.context.active_object
    m, b = principled(name + "Mat", **{"Base Color": (0, 0, 0, 1), "Roughness": 1.0})
    f.data.materials.append(m)
    f.visible_camera = False
    f.visible_shadow = False
    return f
flag("FlagL", -0.26)
flag("FlagR", 0.26)

# ─── camera ───────────────────────────────────────────────────────────────
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 85
cam_data.sensor_fit = "VERTICAL"
cam_data.sensor_height = 36
cam = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam)
if FLIGHT:
    # Square and pulled back: room for the vessel tipped, lifted and its shadow
    cam.location = (0.0, -0.78, 0.15)
    cam.rotation_euler = (Vector((0, 0, 0.112)) - cam.location).to_track_quat("-Z", "Y").to_euler()
else:
    cam.location = (0.0, -0.66, 0.135)
    cam.rotation_euler = (Vector((0, 0, 0.088)) - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam

# ─── render settings ──────────────────────────────────────────────────────
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
for backend in ("OPTIX", "CUDA"):
    try:
        prefs.compute_device_type = backend
        prefs.get_devices()
        if any(d.type == backend for d in prefs.devices):
            for d in prefs.devices:
                d.use = d.type == backend
            scene.cycles.device = "GPU"
            break
    except TypeError:
        continue
c = scene.cycles
c.samples = SAMPLES
c.use_denoising = True
c.seed = 7                              # fixed: no frame-to-frame noise flicker
c.max_bounces = 16
c.transmission_bounces = 16
c.glossy_bounces = 8
c.transparent_max_bounces = 16
c.caustics_reflective = False
c.caustics_refractive = False
c.blur_glossy = 0.5
scene.render.film_transparent = True
if FLIGHT:
    # Clear glass comes out partly transparent, so the page shows through it.
    # The frosted etching stays opaque (its roughness is over the threshold).
    c.film_transparent_glass = True
    c.film_transparent_roughness = 0.1
scene.render.resolution_x = RES_X
scene.render.resolution_y = RES_Y
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = "Standard"
scene.view_settings.look = "None"
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"

# ─── the sequence ─────────────────────────────────────────────────────────
def ease(t):
    return t * t * (3 - 2 * t)

def pose(frame):
    if frame <= 36:
        t = (frame - 1) / 35
        rot, fill, capr = math.radians(-150) * (1 - ease(t)), 0.0, 0.0
    elif frame <= 52:
        t = (frame - 36) / 16
        rot, fill, capr = 0.0, ease(t), 0.0
    else:
        t = (frame - 52) / 8
        rot, fill, capr = 0.0, 1.0, math.radians(90) * ease(t)
    vessel.rotation_euler = (0, 0, rot)
    cap.rotation_euler = (0, 0, capr)
    liquid.hide_render = fill <= 0.001
    liquid.scale = (1, 1, max(fill, 0.001))
    # scale about the floor of the bore, not the origin
    liquid.location = (0, 0, liquid_origin_z * (1 - max(fill, 0.001)))

YAW_REST, LIFT, PITCH, ROLL = -25.0, 0.050, -15.0, 32.0

def pose_flight(frame):
    yaw, lift, pitch, roll, fill, capr = 180.0, 0.0, 0.0, 0.0, 0.0, 0.0
    if frame <= 36:
        t = (frame - 1) / 35
        arc = math.sin(math.pi * t)            # 0 at take-off and landing
        yaw = YAW_REST + (180.0 - YAW_REST) * ease(t)
        lift, pitch, roll = LIFT * arc, PITCH * arc, ROLL * arc
    elif frame <= 66:
        yaw = 180.0 + 180.0 * ease((frame - 36) / 30)
    elif frame <= 82:
        yaw, fill = 360.0, ease((frame - 66) / 16)
    else:
        yaw, fill, capr = 360.0, 1.0, math.radians(90) * ease((frame - 82) / 8)
    pivot.location = (0, 0, Z_MID + lift)
    pivot.rotation_euler = (math.radians(pitch), math.radians(roll), math.radians(yaw))
    cap.rotation_euler = (0, 0, capr)
    liquid.hide_render = fill <= 0.001
    liquid.scale = (1, 1, max(fill, 0.001))
    liquid.location = (0, 0, liquid_origin_z * (1 - max(fill, 0.001)))

if FLIGHT:
    pose = pose_flight

def parse(spec):
    out = []
    for part in spec.split(","):
        if "-" in part:
            a, b = part.split("-")
            out += list(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out

os.makedirs(OUT, exist_ok=True)
for f in parse(FRAMES):
    pose(f)
    scene.render.filepath = os.path.join(OUT, f"{f:04d}.png")
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED {f:04d}", flush=True)
