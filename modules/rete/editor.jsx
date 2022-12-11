import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "./Node";
import { MyControl } from "./Control";

var numSocket = new Rete.Socket("Number value");

class AddComponent extends Rete.Component {
  constructor() {
    super("ActionNode");
  }

  builder(node) {
    var inp = new Rete.Input("in", "InConnection", numSocket, true);
    var out = new Rete.Output("out", "OutConnection", numSocket, true);

    var ctrl = new MyControl(this.editor, "Input", node.data.Input);
    return node.addInput(inp).addOutput(out).addControl(ctrl); //.addControl(ctrl2);
  }

  worker(node, inputs, outputs) {
    outputs["Input"] = node.data.Input;
  }
}

export default async function Editor(container) {
  console.log(container);
  var components = [new AddComponent()];

  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, {
    component: MyNode,
  });
  editor.use(ContextMenuPlugin);

  var engine = new Rete.Engine("demo@0.1.0");

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  var n1 = await components[0].createNode({ Input: "Start" });
  var n2 = await components[0].createNode({ Input: "Cut Skin" });
  var n3 = await components[0].createNode({ Input: "Wash Hands" });
  var n4 = await components[0].createNode({ Input: "Apply Betadine" });
  var n5 = await components[0].createNode({ Input: "End" });
  n1.position = [80, 200];
  n2.position = [320, 200];
  n3.position = [80, 400];
  n4.position = [600, 200];
  n5.position = [850, 200];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(n3);
  editor.addNode(n4);
  editor.addNode(n5);
  editor.connect(n1.outputs.get("out"), n2.inputs.get("in"));
  editor.connect(n2.outputs.get("out"), n3.inputs.get("in"));
  editor.connect(n2.outputs.get("out"), n4.inputs.get("in"));
  editor.connect(n4.outputs.get("out"), n5.inputs.get("in"));
  editor.on("nodecreated", async (node) => {
    console.log("nodecreated");
    console.log(node.id);
    await engine.abort();
    await engine.process(editor.toJSON());
  });
  editor.on("noderemoved", async (node) => {
    console.log("noderemoved");
    console.log(node.id);
    await engine.abort();
    await engine.process(editor.toJSON());
  });

  editor.on("process", async () => {
    console.log("process");
    await engine.abort();
    await engine.process(editor.toJSON());
  });

  editor.on("nodeselected", async (node) => {
    console.log("nodeselected");
    console.log(node.id);

    await engine.abort();
    await engine.process(editor.toJSON());
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
}
