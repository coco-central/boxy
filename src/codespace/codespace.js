import "../generators/javascript";

import { javascriptGenerator } from "blockly/javascript";
import highlight from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";

import workspace from "../workspace/workspace";

class BoxyCodespace {
  /**
   * 代码区
   * @constructor
   */
  constructor() {
    this.blocklyDiv = document.getElementById("blocklyDiv");
    this.workspaceDiv = document.getElementById("workspace");
    this.codespaceDiv = document.getElementById("codespace");
    this.codespaceHeadDiv = document.getElementById("codespaceHead");
    this.codeDiv = document.getElementById("code");
    this.codespaceButton = document.getElementById("switchCode");
  }

  /**
   * 加载代码区高亮、监听器。
   * @method
   */
  load = () => {
    // 代码区高亮
    highlight.registerLanguage("javascript", javascript);
    highlight.highlightAll();
    // 代码区尺寸变化监听器
    this.workspaceDiv.addEventListener("resize", this.resize);
    window.addEventListener("resize", this.resize);
    this.resize();
  };

  /**
   * 将工作区内容转化为代码，并提供高亮。
   * @method
   */
  updateCode = () => {
    let code = javascriptGenerator.workspaceToCode(workspace.workspace);
    if (code === "") {
      this.codeDiv.innerHTML = "未检测到积木块";
    } else {
      this.codeDiv.innerHTML = code;
    }
    highlight.highlightAll();
  };

  /**
   * 根据当前用户窗口大小，重置代码区尺寸。
   * @method
   */
  resize = () => {
    this.codespaceDiv.style.width = this.width() + "px";
    if (this.width() === window.innerWidth) {
      this.codespaceHeadDiv.style.display = "block";
      this.codeDiv.style.marginTop = "0px";
    } else {
      this.codespaceHeadDiv.style.display = "none";
      this.codeDiv.style.marginTop = "20px";
    }
  };

  /**
   * 打开代码区
   */
  open = () => {
    this.blocklyDiv.setAttribute("code", "");
    this.codespaceDiv.setAttribute("code", "");
    this.codespaceButton.style.color = "var(--boxy-color)";
    workspace.resize();
    this.resize();
  };

  /**
   * 关闭代码区
   */
  close = () => {
    this.blocklyDiv.removeAttribute("code");
    this.codespaceDiv.removeAttribute("code");
    this.codespaceButton.style.color = "var(--zoombox-color)";
    workspace.resize();
    this.resize();
  };

  /**
   * 切换代码区收放
   */
  switch = () => {
    if (this.blocklyDiv.getAttributeNames().indexOf("code") === -1) {
      this.open();
    } else {
      this.close();
    }
  };

  /**
   * 计算代码区应有宽度。
   * @method
   * @returns {number} 宽度(px)
   */
  width = () => {
    if (this.codespaceDiv.getAttributeNames().indexOf("code") === -1) {
      return 0;
    } else {
      const toolboxDiv = document.getElementsByClassName("blocklyToolboxDiv")[0];
      const toolboxWidth = toolboxDiv.getBoundingClientRect().width;
      const flyoutDiv = document.querySelector("#workspace > div > svg.blocklyFlyout");
      const flyoutWidth = flyoutDiv.getBoundingClientRect().width;
      const codespaceWidth = 350 + Math.log(window.innerWidth);
      if (window.innerWidth > toolboxWidth + flyoutWidth + codespaceWidth) {
        return 350 + Math.log(window.innerWidth);
      } else {
        return window.innerWidth;
      }
    }
  };
}

let codespace = new BoxyCodespace();
codespace.load();
export default codespace;
