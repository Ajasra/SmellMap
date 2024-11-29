import { extend } from "@react-three/fiber";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { Line2, LineMaterial, LineGeometry } from "three/examples/jsm/lines/Line2";

extend({ Line2, LineMaterial, LineGeometry, MeshLine, MeshLineMaterial });