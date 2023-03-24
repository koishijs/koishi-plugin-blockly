import {
  Block,
  BlocklyOptions,
  BlockSvg,
  Bubble,
  FieldImage,
  Icon,
  Mutator,
  Options,
  Workspace,
  WorkspaceSvg
} from "blockly";
import * as Blockly from "blockly";
import {ReactiveBindingSet, ReactiveValue} from "../binding";
import {} from '../typing/'
import {convertTypeToBlock} from "../typing/converter";
const {dom,Svg,Coordinate} = Blockly.utils

declare module "blockly"{
  interface Workspace{
    typings: ReactiveBindingSet<ReactiveValue<any>>
  }
  interface Block{
    type_manager: TypeManager
    getTypeOutput(inputs:any[]):any
  }
}

function disableAllBlock(root_block:Block){
  root_block.setMovable(false)
  root_block.setEditable(false)
  root_block.setDeletable(false)
  root_block.getChildren(false).forEach(disableAllBlock)
}

function renderAllBlock(root_block:BlockSvg){
  root_block.render()
  root_block.getChildren(false).forEach(renderAllBlock)
}

export class TypeMutator extends Icon{

  /** Width of workspace. */
  private workspaceWidth = 0;

  /** Height of workspace. */
  private workspaceHeight = 0;
  private svgDialog: SVGGElement;

  protected drawIcon_(group: Element) {
    // Square with rounded corners.
    dom.createSvgElement(
      Svg.RECT, {
        'class': 'blocklyIconShape',
        'rx': '4',
        'ry': '4',
        'height': '16',
        'width': '16',
      },
      group);
    const g = dom.createSvgElement(Svg.G,{
      transform:"scale(0.024,0.024)translate(45,60)",
    },group)
    // Gear teeth.
    dom.createSvgElement(
      Svg.PATH, {
        'class': 'blocklyIconSymbol',
        'd': 'M118.6 80c-11.5 0-21.4 7.9-24 19.1L57 260.3c20.5-6.2 48.3-12.3 78.7-12.3c32.3 0 61.8 6.9 82.8 13.5c10.6 3.3 19.3 6.7 25.4 9.2c3.1 1.3 5.5 2.4 7.3 3.2c.9 .4 1.6 .7 2.1 1l.6 .3 .2 .1 .1 0 0 0 0 0s0 0-6.3 12.7h0l6.3-12.7c5.8 2.9 10.4 7.3 13.5 12.7h40.6c3.1-5.3 7.7-9.8 13.5-12.7l6.3 12.7h0c-6.3-12.7-6.3-12.7-6.3-12.7l0 0 0 0 .1 0 .2-.1 .6-.3c.5-.2 1.2-.6 2.1-1c1.8-.8 4.2-1.9 7.3-3.2c6.1-2.6 14.8-5.9 25.4-9.2c21-6.6 50.4-13.5 82.8-13.5c30.4 0 58.2 6.1 78.7 12.3L481.4 99.1c-2.6-11.2-12.6-19.1-24-19.1c-3.1 0-6.2 .6-9.2 1.8L416.9 94.3c-12.3 4.9-26.3-1.1-31.2-13.4s1.1-26.3 13.4-31.2l31.3-12.5c8.6-3.4 17.7-5.2 27-5.2c33.8 0 63.1 23.3 70.8 56.2l43.9 188c1.7 7.3 2.9 14.7 3.5 22.1c.3 1.9 .5 3.8 .5 5.7v6.7V352v16c0 61.9-50.1 112-112 112H419.7c-59.4 0-108.5-46.4-111.8-105.8L306.6 352H269.4l-1.2 22.2C264.9 433.6 215.8 480 156.3 480H112C50.1 480 0 429.9 0 368V352 310.7 304c0-1.9 .2-3.8 .5-5.7c.6-7.4 1.8-14.8 3.5-22.1l43.9-188C55.5 55.3 84.8 32 118.6 32c9.2 0 18.4 1.8 27 5.2l31.3 12.5c12.3 4.9 18.3 18.9 13.4 31.2s-18.9 18.3-31.2 13.4L127.8 81.8c-2.9-1.2-6-1.8-9.2-1.8zM64 325.4V368c0 26.5 21.5 48 48 48h44.3c25.5 0 46.5-19.9 47.9-45.3l2.5-45.6c-2.3-.8-4.9-1.7-7.5-2.5c-17.2-5.4-39.9-10.5-63.6-10.5c-23.7 0-46.2 5.1-63.2 10.5c-3.1 1-5.9 1.9-8.5 2.9zM512 368V325.4c-2.6-.9-5.5-1.9-8.5-2.9c-17-5.4-39.5-10.5-63.2-10.5c-23.7 0-46.4 5.1-63.6 10.5c-2.7 .8-5.2 1.7-7.5 2.5l2.5 45.6c1.4 25.4 22.5 45.3 47.9 45.3H464c26.5 0 48-21.5 48-48z',
      },
      g);
  }
  display_workspace_:WorkspaceSvg
  createDisplay():SVGGElement{
    this.svgDialog = dom.createSvgElement(
      Svg.SVG, {'x': Bubble.BORDER_WIDTH, 'y': Bubble.BORDER_WIDTH});

    const block = this.getBlock();
    const workspaceOptions = new Options(({
      'disable': true,
      'media': block.workspace.options.pathToMedia,
      'rtl': block.RTL,
      'horizontalLayout': false,
      'renderer': block.workspace.options.renderer,
      'rendererOverrides': block.workspace.options.rendererOverrides,
    } as BlocklyOptions));

    this.display_workspace_ = new WorkspaceSvg(workspaceOptions)

    const background = this.display_workspace_.createDom('blocklyMutatorBackground')

    this.svgDialog.appendChild(background);

    return this.svgDialog;

  }
  setVisible(_visible: boolean) {
    console.info("BP0")
    if(_visible == this.isVisible())return
    if(_visible){
      const block = this.getBlock();
      console.info(this.iconXY_)
      this.bubble_ = new Bubble(
        block.workspace, this.createDisplay(), block.pathObject.svgPath,
        (this.iconXY_), null, null);
      const ws = this.display_workspace_!;
      this.bubble_.setSvgId(block.id);
      this.bubble_.registerMoveEvent(this.onBubbleMove.bind(this));
      const tree = ws.options.languageTree;
      const flyout = ws.getFlyout();
      this.resizeBubble();
      this.applyColour();
      const root_block = this.display_workspace_.newBlock('type_root')
      root_block.initSvg()
      root_block.moveTo(new Coordinate(10,10))
      this.display_workspace_.addTopBlock(root_block)
      if(this.getBlock().getOutputType){
        const topType = convertTypeToBlock(this.display_workspace_,this.getBlock().getOutputType())
        if(topType){
          topType.initSvg()
          root_block.getInput('type').connection.connect(topType.outputConnection)
          topType.render()
        }
      }else{
        const topType = this.display_workspace_.newBlock('type_any')
        topType.initSvg()
        root_block.getInput('type').connection.connect(topType.outputConnection)
        topType.render()
      }
      renderAllBlock(root_block)
      disableAllBlock(root_block)
      this.display_workspace_.scrollCenter()
      this.resizeBubble()
    }else{
      this.display_workspace_.getTopBlocks(false)
        .forEach((b)=> {
          this.display_workspace_.removeTopBlock(b)
        })
      this.svgDialog = null;
      this.display_workspace_.dispose()
      this.display_workspace_ = null
      this.bubble_.dispose();
      this.bubble_ = null;
      this.workspaceWidth = 0;
      this.workspaceHeight = 0;
      /*if (this.sourceListener) {
        block.workspace.removeChangeListener(this.sourceListener);
        this.sourceListener = null;
      }*/
    }
  }
  protected resizeBubble() {
    if (!this.display_workspace_) {
      return;
    }
    const doubleBorderWidth = 2 * Bubble.BORDER_WIDTH;
    const canvas = this.display_workspace_.getCanvas();
    const workspaceSize = canvas.getBBox();
    let width = workspaceSize.width + workspaceSize.x;
    let height = workspaceSize.height + doubleBorderWidth * 3;
    const flyout = this.display_workspace_.getFlyout();
    if (flyout) {
      const flyoutScrollMetrics =
        flyout.getWorkspace().getMetricsManager().getScrollMetrics();
      height = Math.max(height, flyoutScrollMetrics.height + 20);
      width += flyout.getWidth();
    }

    const isRtl = this.getBlock().RTL;
    if (isRtl) {
      width = -workspaceSize.x;
    }
    width += doubleBorderWidth * 3;
    if (Math.abs(this.workspaceWidth - width) > doubleBorderWidth ||
      Math.abs(this.workspaceHeight - height) > doubleBorderWidth) {
      this.workspaceWidth = width;
      this.workspaceHeight = height;
      this.bubble_!.setBubbleSize(
        width + doubleBorderWidth, height + doubleBorderWidth);
      this.svgDialog!.setAttribute('width', `${width}`);
      this.svgDialog!.setAttribute('height', `${height}`);
      this.display_workspace_.setCachedParentSvgSize(width, height);
    }
    if (isRtl) {
      canvas.setAttribute('transform', `translate(${this.workspaceWidth}, 0)`);
    }
    this.display_workspace_.resize();
  }
  onBubbleMove(){
    this.display_workspace_?.recordDragTargets();
  }
}

export class TypeManager{
  constructor(protected block:Block) {
    const output = block
  }
}

export function registerTypeManager(workspace:Workspace){
  workspace.typings = new ReactiveBindingSet<ReactiveValue<any>>()
  Object.keys(Blockly.Blocks).forEach(k=>{
    const _init = Blockly.Blocks[k].init
    if(k.startsWith('type_'))return
    Blockly.Blocks[k].init = function(this:BlockSvg){
      _init.call(this)
      this.type_manager = new TypeManager(this)
      if(!this.outputConnection)return
      const mutator = new TypeMutator(this)
      //mutator.setVisible(true)
      const getIcon_ = this.getIcons.bind(this)
      this.getIcons = ()=>{
        return [...getIcon_(),mutator]
      }
    }
  })
}
