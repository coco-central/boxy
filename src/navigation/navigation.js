import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import $ from "jquery";

import dialog from "../dialog/dialog";
import newPage from "../navigation/pages/new.html";
import opinionPage from "../navigation/pages/opinion.html";
import theme from "../theme/theme";
import cookies from "../utils/cookies";
import workspace from "../workspace/workspace";

class BoxyNavigation {
  /**
   * 导航栏
   * @constructor
   */
  constructor() {
    this.navigationDiv = document.getElementById("navigation");
    this.boxyMenuJQ = $(".boxyMenu");
    this.extendedName = ".boxy";
  }

  /**
   * 加载导航栏点击动作，禁用右键菜单。
   * @method
   */
  load = () => {
    let boxyMenu = $(".boxyMenu");
    $(document).ready(function () {
      $("#navigation").on("click", function (event) {
        event.stopPropagation();
        boxyMenu.toggle(100);
        if (boxyMenu.is(":visible")) {
          $(document).on("click", function () {
            boxyMenu.hide(100);
          });
        }
      });
      boxyMenu.on("click", function (e) {
        e.stopPropagation();
      });
    });
    boxyMenu.hide();

    this.navigationDiv.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  };

  /**
   * 新建按钮动作。
   * @method
   */
  new = () => {
    dialog.open(newPage);
    this.boxyMenuJQ.hide();
    window.blankProject = function () {
      workspace.workspace.clear();
      dialog.close();
    };
  };

  /**
   * 打开按钮动作。
   * @method
   */
  open = () => {
    this.boxyMenuJQ.hide();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("name", "file");
    input.setAttribute("accept", this.extendedName);
    input.addEventListener("change", function () {
      const file = this.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        const json = JSON.parse(this.result || "");
        Blockly.serialization.workspaces.load(json["content"], workspace.workspace);
        console.log("[Boxy] Opened:");
        console.log(JSON.stringify(json, null, "  "));
      });
      reader.readAsText(file);
    });
    input.click();
  };

  /**
   * 保存到本地按钮动作。
   * @method
   */
  save = () => {
    this.boxyMenuJQ.hide();
    const json = Blockly.serialization.workspaces.save(workspace.workspace);
    const data = { name: "Boxy Project Demo", editorVersion: 1, content: json };
    const text = JSON.stringify(data, null, "  ");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "name" + ".boxy";
    anchor.click();
    console.log("[Boxy] Saved:");
    console.log(text);
  };

  /**
   * 导出到目标文件按钮动作。
   * @method
   */
  export = () => {
    this.boxyMenuJQ.hide();
    const jsCode = javascriptGenerator.workspaceToCode(workspace.workspace);
    const blob = new Blob([jsCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "boxy" + ".js";
    anchor.click();
    console.log("[Boxy] Generated:");
    console.log(jsCode);
  };

  /**
   * 选项按钮动作。
   * @method
   */
  options = () => {
    dialog.open(opinionPage);
    this.boxyMenuJQ.hide();
    $(".boxyTab").on("click", function () {
      $(".OptionTabContent").attr("class", "OptionTabContent");
      $(".boxyTab").attr("class", "boxyTab");
      this.setAttribute("class", "boxyTab active");
      $(`#boxyTabContent${this.getAttribute("id").slice(7)}`).attr("class", "OptionTabContent active");
    });
    document.querySelector("#turnTheme").setAttribute("name", cookies.get("theme") ? cookies.get("theme") : "auto");
    $("#turnTheme").on("click", function () {
      if (this.getAttribute("name") === "light") {
        this.setAttribute("name", "dark");
        theme.switch("dark");
        cookies.set("theme", "dark");
      } else if (this.getAttribute("name") === "dark") {
        this.setAttribute("name", "auto");
        theme.switch(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        cookies.set("theme", "", 0);
      } else {
        this.setAttribute("name", "light");
        theme.switch("light");
        cookies.set("theme", "light");
      }
    });
  };
}

let navigation = new BoxyNavigation();
navigation.load();
export default navigation;

// 新建
window.navigationNew = navigation.new;
// 打开
window.navigationOpen = navigation.open;
// 保存
window.navigationSave = navigation.save;
// 导出
window.navigationExport = navigation.export;
// 选项
window.navigationOptions = navigation.options;
