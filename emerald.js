function runEmerald() {
  const code = document.getElementById("code").value;
  const outputEl = document.getElementById("output");
  outputEl.textContent = "";

  const context = { vars: {} };

  function log(text) {
    outputEl.textContent += text + "\n";
  }

  function error(text) {
    outputEl.textContent += "ERROR: " + text + "\n";
  }

  function evalMath(str) {
    try {
      return eval(str);
    } catch {
      return str;
    }
  }

  function evalValue(val) {
    if (val.startsWith("{") && val.endsWith("}")) {
      const name = val.slice(1, -1);
      return context.vars[name];
    }
    if (val === "true") return true;
    if (val === "false") return false;
    if (!isNaN(Number(val))) return Number(val);
    return evalMath(val);
  }

  function evalExpression(expr) {
    expr = expr.replace(/\bAND\b/g, "&&");
    expr = expr.replace(/\bOR\b/g, "||");
    expr = expr.replace(/\bNOT\b/g, "!");
    expr = expr.replace(/{([^}]+)}/g, (m, name) => JSON.stringify(context.vars[name]));
    return eval(expr);
  }

  const lines = code.split("\n").map(l => l.trim());
  let i = 0;

  function parseBlock() {
    const block = [];
    while (i < lines.length) {
      const line = lines[i].trim();

      if (line === "]") {
        i++;
        break;
      }

      block.push(line);
      i++;
    }
    return block;
  }

  function runBlock(block) {
    let idx = 0;
    while (idx < block.length) {
      const line = block[idx];

      if (!line || line.startsWith("--") || line.startsWith("//")) {
        idx++;
        continue;
      }

      if (line.startsWith("output.log=")) {
        const val = line.split("=")[1].trim();
        log(evalValue(val));
        idx++;
      } else if (line.startsWith("output.error=")) {
        const val = line.split("=")[1].trim();
        error(evalValue(val));
        idx++;
      } else if (line.startsWith("var")) {
        const name = line.match(/var"([^"]+)"/)[1];
        const val = line.split("=")[1].trim();
        context.vars[name] = evalValue(val);
        idx++;
      } else if (lin
