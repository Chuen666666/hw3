(function (global) {
  "use strict";

  const RELATION_LABELS = Object.freeze({
    father: "爸爸",
    mother: "媽媽",
    olderBrother: "哥哥",
    youngerBrother: "弟弟",
    olderSister: "姊姊",
    youngerSister: "妹妹",
    husband: "丈夫",
    wife: "妻子",
    olderSon: "兒子（較年長）",
    youngerSon: "兒子（較年輕）",
    olderDaughter: "女兒（較年長）",
    youngerDaughter: "女兒（較年輕）",
  });

  const VALID_GENDERS = new Set(["male", "female"]);
  const graphCache = new Map();

  function buildGraph(rootGender) {
    if (!VALID_GENDERS.has(rootGender)) {
      throw new TypeError("rootGender must be male or female");
    }

    const people = new Map();

    function person(id, gender, title) {
      const node = {
        id,
        gender,
        title,
        father: null,
        mother: null,
        spouse: null,
        children: [],
        siblings: [],
        birthOrder: null,
      };
      people.set(id, node);
      return node;
    }

    function family(father, mother, children) {
      father.spouse = mother;
      mother.spouse = father;
      father.children = children;
      mother.children = children;

      children.forEach(function (child, index) {
        child.father = father;
        child.mother = mother;
        child.siblings = children;
        child.birthOrder = index;
      });
    }

    function addFourCousins(prefix, adult, spouse, familyType) {
      const children = [
        person(prefix + "-older-son", "male", familyType + "兄"),
        person(prefix + "-older-daughter", "female", familyType + "姊"),
        person(prefix + "-younger-son", "male", familyType + "弟"),
        person(prefix + "-younger-daughter", "female", familyType + "妹"),
      ];

      if (adult.gender === "male") {
        family(adult, spouse, children);
      } else {
        family(spouse, adult, children);
      }
    }

    function addNiblings(prefix, adult, spouse, maleTitle, femaleTitle) {
      const children = [
        person(prefix + "-son", "male", maleTitle),
        person(prefix + "-daughter", "female", femaleTitle),
      ];

      if (adult.gender === "male") {
        family(adult, spouse, children);
      } else {
        family(spouse, adult, children);
      }
    }

    const root = person("root", rootGender, "我");
    const father = person("father", "male", "父親");
    const mother = person("mother", "female", "母親");
    const olderBrother = person("older-brother", "male", "哥哥");
    const olderSister = person("older-sister", "female", "姊姊");
    const youngerBrother = person("younger-brother", "male", "弟弟");
    const youngerSister = person("younger-sister", "female", "妹妹");

    family(father, mother, [
      olderBrother,
      olderSister,
      root,
      youngerBrother,
      youngerSister,
    ]);

    const olderBrotherWife = person("older-brother-wife", "female", "嫂嫂");
    const youngerBrotherWife = person("younger-brother-wife", "female", "弟媳");
    const olderSisterHusband = person("older-sister-husband", "male", "姊夫");
    const youngerSisterHusband = person(
      "younger-sister-husband",
      "male",
      "妹夫",
    );
    addNiblings(
      "older-brother",
      olderBrother,
      olderBrotherWife,
      "姪子",
      "姪女",
    );
    addNiblings(
      "younger-brother",
      youngerBrother,
      youngerBrotherWife,
      "姪子",
      "姪女",
    );
    addNiblings(
      "older-sister",
      olderSister,
      olderSisterHusband,
      "外甥",
      "外甥女",
    );
    addNiblings(
      "younger-sister",
      youngerSister,
      youngerSisterHusband,
      "外甥",
      "外甥女",
    );

    const paternalGrandfather = person("paternal-grandfather", "male", "祖父");
    const paternalGrandmother = person(
      "paternal-grandmother",
      "female",
      "祖母",
    );
    const paternalOlderAunt = person("paternal-older-aunt", "female", "姑媽");
    const paternalOlderUncle = person("paternal-older-uncle", "male", "伯父");
    const paternalYoungerUncle = person(
      "paternal-younger-uncle",
      "male",
      "叔父",
    );
    const paternalYoungerAunt = person(
      "paternal-younger-aunt",
      "female",
      "姑媽",
    );
    family(paternalGrandfather, paternalGrandmother, [
      paternalOlderAunt,
      paternalOlderUncle,
      father,
      paternalYoungerUncle,
      paternalYoungerAunt,
    ]);

    const paternalOlderUncleWife = person(
      "paternal-older-uncle-wife",
      "female",
      "伯母",
    );
    const paternalYoungerUncleWife = person(
      "paternal-younger-uncle-wife",
      "female",
      "嬸嬸",
    );
    const paternalOlderAuntHusband = person(
      "paternal-older-aunt-husband",
      "male",
      "姑丈",
    );
    const paternalYoungerAuntHusband = person(
      "paternal-younger-aunt-husband",
      "male",
      "姑丈",
    );
    addFourCousins(
      "paternal-older-uncle",
      paternalOlderUncle,
      paternalOlderUncleWife,
      "堂",
    );
    addFourCousins(
      "paternal-younger-uncle",
      paternalYoungerUncle,
      paternalYoungerUncleWife,
      "堂",
    );
    addFourCousins(
      "paternal-older-aunt",
      paternalOlderAunt,
      paternalOlderAuntHusband,
      "表",
    );
    addFourCousins(
      "paternal-younger-aunt",
      paternalYoungerAunt,
      paternalYoungerAuntHusband,
      "表",
    );

    const maternalGrandfather = person(
      "maternal-grandfather",
      "male",
      "外祖父",
    );
    const maternalGrandmother = person(
      "maternal-grandmother",
      "female",
      "外祖母",
    );
    const maternalOlderAunt = person("maternal-older-aunt", "female", "姨媽");
    const maternalOlderUncle = person("maternal-older-uncle", "male", "舅舅");
    const maternalYoungerUncle = person(
      "maternal-younger-uncle",
      "male",
      "舅舅",
    );
    const maternalYoungerAunt = person(
      "maternal-younger-aunt",
      "female",
      "姨媽",
    );
    family(maternalGrandfather, maternalGrandmother, [
      maternalOlderAunt,
      maternalOlderUncle,
      mother,
      maternalYoungerUncle,
      maternalYoungerAunt,
    ]);

    const maternalOlderUncleWife = person(
      "maternal-older-uncle-wife",
      "female",
      "舅媽",
    );
    const maternalYoungerUncleWife = person(
      "maternal-younger-uncle-wife",
      "female",
      "舅媽",
    );
    const maternalOlderAuntHusband = person(
      "maternal-older-aunt-husband",
      "male",
      "姨丈",
    );
    const maternalYoungerAuntHusband = person(
      "maternal-younger-aunt-husband",
      "male",
      "姨丈",
    );
    addFourCousins(
      "maternal-older-uncle",
      maternalOlderUncle,
      maternalOlderUncleWife,
      "表",
    );
    addFourCousins(
      "maternal-younger-uncle",
      maternalYoungerUncle,
      maternalYoungerUncleWife,
      "表",
    );
    addFourCousins(
      "maternal-older-aunt",
      maternalOlderAunt,
      maternalOlderAuntHusband,
      "表",
    );
    addFourCousins(
      "maternal-younger-aunt",
      maternalYoungerAunt,
      maternalYoungerAuntHusband,
      "表",
    );

    const spouseGender = rootGender === "male" ? "female" : "male";
    const spouse = person(
      "spouse",
      spouseGender,
      rootGender === "male" ? "妻" : "夫",
    );
    const spousePrefix = rootGender === "male" ? "妻" : "夫";
    const spouseFather = person("spouse-father", "male", spousePrefix + "父");
    const spouseMother = person("spouse-mother", "female", spousePrefix + "母");
    const spouseOlderBrother = person(
      "spouse-older-brother",
      "male",
      spousePrefix + "兄",
    );
    const spouseOlderSister = person(
      "spouse-older-sister",
      "female",
      spousePrefix + "姊",
    );
    const spouseYoungerBrother = person(
      "spouse-younger-brother",
      "male",
      spousePrefix + "弟",
    );
    const spouseYoungerSister = person(
      "spouse-younger-sister",
      "female",
      spousePrefix + "妹",
    );
    family(spouseFather, spouseMother, [
      spouseOlderBrother,
      spouseOlderSister,
      spouse,
      spouseYoungerBrother,
      spouseYoungerSister,
    ]);

    const spouseOlderBrotherWife = person(
      "spouse-older-brother-wife",
      "female",
      spousePrefix + "兄嫂",
    );
    const spouseYoungerBrotherWife = person(
      "spouse-younger-brother-wife",
      "female",
      spousePrefix + "弟媳",
    );
    const spouseOlderSisterHusband = person(
      "spouse-older-sister-husband",
      "male",
      spousePrefix + "姊夫",
    );
    const spouseYoungerSisterHusband = person(
      "spouse-younger-sister-husband",
      "male",
      spousePrefix + "妹夫",
    );
    addNiblings(
      "spouse-older-brother",
      spouseOlderBrother,
      spouseOlderBrotherWife,
      "外甥",
      "外甥女",
    );
    addNiblings(
      "spouse-younger-brother",
      spouseYoungerBrother,
      spouseYoungerBrotherWife,
      "外甥",
      "外甥女",
    );
    addNiblings(
      "spouse-older-sister",
      spouseOlderSister,
      spouseOlderSisterHusband,
      "外甥",
      "外甥女",
    );
    addNiblings(
      "spouse-younger-sister",
      spouseYoungerSister,
      spouseYoungerSisterHusband,
      "外甥",
      "外甥女",
    );

    const olderSon = person("older-son", "male", "兒子");
    const olderDaughter = person("older-daughter", "female", "女兒");
    const youngerSon = person("younger-son", "male", "兒子");
    const youngerDaughter = person("younger-daughter", "female", "女兒");

    if (rootGender === "male") {
      family(root, spouse, [
        olderSon,
        olderDaughter,
        youngerSon,
        youngerDaughter,
      ]);
    } else {
      family(spouse, root, [
        olderSon,
        olderDaughter,
        youngerSon,
        youngerDaughter,
      ]);
    }

    [olderSon, youngerSon].forEach(function (son, index) {
      const wife = person("son-" + index + "-wife", "female", "媳婦");
      const grandson = person("son-" + index + "-son", "male", "孫子");
      const granddaughter = person(
        "son-" + index + "-daughter",
        "female",
        "孫女",
      );
      family(son, wife, [grandson, granddaughter]);
    });

    [olderDaughter, youngerDaughter].forEach(function (daughter, index) {
      const husband = person("daughter-" + index + "-husband", "male", "女婿");
      const externalGrandson = person(
        "daughter-" + index + "-son",
        "male",
        "外孫",
      );
      const externalGranddaughter = person(
        "daughter-" + index + "-daughter",
        "female",
        "外孫",
      );
      family(husband, daughter, [externalGrandson, externalGranddaughter]);
    });

    return { root, people };
  }

  function getGraph(gender) {
    if (!graphCache.has(gender)) {
      graphCache.set(gender, buildGraph(gender));
    }
    return graphCache.get(gender);
  }

  function findSibling(person, gender, direction) {
    if (person.birthOrder === null || !person.siblings.length) {
      return null;
    }

    const candidates = person.siblings.filter(function (candidate) {
      if (candidate === person || candidate.gender !== gender) {
        return false;
      }
      return direction === "older"
        ? candidate.birthOrder < person.birthOrder
        : candidate.birthOrder > person.birthOrder;
    });

    candidates.sort(function (a, b) {
      return direction === "older"
        ? b.birthOrder - a.birthOrder
        : a.birthOrder - b.birthOrder;
    });

    return candidates[0] || null;
  }

  function findChild(person, gender, direction) {
    const candidates = person.children
      .filter(function (child) {
        return child.gender === gender;
      })
      .sort(function (a, b) {
        return a.birthOrder - b.birthOrder;
      });

    if (!candidates.length) {
      return null;
    }

    return direction === "older"
      ? candidates[0]
      : candidates[candidates.length - 1];
  }

  function follow(person, relation) {
    switch (relation) {
      case "father":
        return person.father;
      case "mother":
        return person.mother;
      case "husband":
        return person.gender === "female" &&
          person.spouse &&
          person.spouse.gender === "male"
          ? person.spouse
          : null;
      case "wife":
        return person.gender === "male" &&
          person.spouse &&
          person.spouse.gender === "female"
          ? person.spouse
          : null;
      case "olderBrother":
        return findSibling(person, "male", "older");
      case "youngerBrother":
        return findSibling(person, "male", "younger");
      case "olderSister":
        return findSibling(person, "female", "older");
      case "youngerSister":
        return findSibling(person, "female", "younger");
      case "olderSon":
        return findChild(person, "male", "older");
      case "youngerSon":
        return findChild(person, "male", "younger");
      case "olderDaughter":
        return findChild(person, "female", "older");
      case "youngerDaughter":
        return findChild(person, "female", "younger");
      default:
        return null;
    }
  }

  function resolvePath(graph, steps) {
    let current = graph.root;

    for (const relation of steps) {
      current = follow(current, relation);
      if (!current) {
        return null;
      }
    }

    return current;
  }

  function evaluate(steps, rootGender) {
    if (!VALID_GENDERS.has(rootGender)) {
      return {
        ok: false,
        code: "gender-required",
        message: "請先選擇「我（男）」或「我（女）」",
      };
    }

    if (!Array.isArray(steps) || !steps.length) {
      return {
        ok: false,
        code: "empty",
        message: "請先輸入至少一個親屬關係",
      };
    }

    if (
      steps.some(function (step) {
        return !Object.hasOwn(RELATION_LABELS, step);
      })
    ) {
      return {
        ok: false,
        code: "invalid-step",
        message: "輸入中包含無效的親屬關係",
      };
    }

    const match = resolvePath(getGraph(rootGender), steps);

    if (!match) {
      return {
        ok: false,
        code: "out-of-scope",
        message: "這個組合不在本次作業的親屬範圍內",
      };
    }

    return {
      ok: true,
      code: "resolved",
      title: match.title,
    };
  }

  function buildExpression(steps, rootGender) {
    const rootLabel = rootGender === "male" ? "我（男）" : "我（女）";

    if (!steps.length) {
      return rootLabel;
    }

    return (
      rootLabel +
      "的" +
      steps
        .map(function (step) {
          return RELATION_LABELS[step];
        })
        .join("的")
    );
  }

  global.KinshipEngine = Object.freeze({
    evaluate,
    buildExpression,
    relationLabels: RELATION_LABELS,
  });

  if (typeof document === "undefined") {
    return;
  }

  const elements = {
    expression: document.getElementById("expression"),
    result: document.getElementById("result"),
    stepCount: document.getElementById("step-count"),
    viewpointStatus: document.getElementById("viewpoint-status"),
    rootRequiredMessage: document.getElementById("root-required-message"),
    interactionStatus: document.getElementById("interaction-status"),
    rootButtons: Array.from(document.querySelectorAll("[data-root]")),
    relationButtons: Array.from(document.querySelectorAll("[data-relation]")),
    evaluateButton: document.querySelector('[data-action="evaluate"]'),
    backButton: document.querySelector('[data-action="back"]'),
  };

  let state = {
    rootGender: null,
    steps: [],
    result: null,
  };
  const history = [];
  const LONG_PRESS_MS = 700;
  let backPressTimer = null;
  let longPressTriggered = false;
  let keyboardPressActive = false;
  let suppressKeyboardClick = false;

  function cloneState() {
    return {
      rootGender: state.rootGender,
      steps: state.steps.slice(),
      result: state.result ? Object.assign({}, state.result) : null,
    };
  }

  function performAction(change) {
    history.push(cloneState());
    if (history.length > 100) {
      history.shift();
    }
    change();
    render();
  }

  function render() {
    const hasRoot = VALID_GENDERS.has(state.rootGender);
    const hasInput = state.steps.length > 0;
    elements.expression.textContent =
      hasRoot && hasInput
        ? buildExpression(state.steps, state.rootGender)
        : hasRoot
          ? buildExpression([], state.rootGender)
          : "請先選擇「我（男）」或「我（女）」";

    elements.stepCount.textContent = state.steps.length + " 步";
    elements.viewpointStatus.textContent =
      state.rootGender === "male"
        ? "視角：我（男）"
        : state.rootGender === "female"
          ? "視角：我（女）"
          : "視角：尚未選擇";

    elements.rootRequiredMessage.textContent = hasRoot
      ? "已完成選擇"
      : "請選擇其中一項";
    elements.rootRequiredMessage.classList.toggle("is-complete", hasRoot);

    elements.rootButtons.forEach(function (button) {
      button.setAttribute(
        "aria-checked",
        String(button.dataset.root === state.rootGender),
      );
    });

    elements.relationButtons.forEach(function (button) {
      button.disabled = !hasRoot;
    });
    elements.evaluateButton.disabled = !hasRoot;

    elements.result.classList.remove("is-success", "is-error");
    if (!state.result) {
      elements.result.textContent = hasRoot ? "等待輸入" : "尚未選擇視角";
      return;
    }

    if (state.result.ok) {
      elements.result.textContent = state.result.title;
      elements.result.classList.add("is-success");
    } else {
      elements.result.textContent = state.result.message;
      elements.result.classList.add("is-error");
    }
  }

  elements.relationButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (!VALID_GENDERS.has(state.rootGender)) {
        return;
      }
      performAction(function () {
        state.steps.push(button.dataset.relation);
        state.result = null;
      });
    });
  });

  elements.rootButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.rootGender = button.dataset.root;
      state.steps = [];
      state.result = null;
      history.length = 0;
      render();
    });

    button.addEventListener("keydown", function (event) {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        return;
      }
      event.preventDefault();
      const nextButton = elements.rootButtons.find(function (candidate) {
        return candidate !== button;
      });
      nextButton.click();
      nextButton.focus();
    });
  });

  elements.evaluateButton.addEventListener("click", function () {
    if (!VALID_GENDERS.has(state.rootGender)) {
      return;
    }
    performAction(function () {
      state.result = evaluate(state.steps, state.rootGender);
    });
  });

  function goBack() {
    if (!history.length) {
      state.result = {
        ok: false,
        code: VALID_GENDERS.has(state.rootGender)
          ? "no-history"
          : "gender-required",
        message: VALID_GENDERS.has(state.rootGender)
          ? "目前沒有可以返回的步驟"
          : "請先選擇「我（男）」或「我（女）」",
      };
      render();
      return;
    }

    state = history.pop();
    render();
  }

  function clearAllRelations() {
    state.steps = [];
    state.result = null;
    history.length = 0;
    render();
    elements.interactionStatus.textContent = "已清除所有親屬關係";
  }

  function startBackPress() {
    window.clearTimeout(backPressTimer);
    longPressTriggered = false;
    elements.backButton.classList.add("is-pressing");
    backPressTimer = window.setTimeout(function () {
      longPressTriggered = true;
      clearAllRelations();
    }, LONG_PRESS_MS);
  }

  function endBackPress() {
    window.clearTimeout(backPressTimer);
    backPressTimer = null;
    elements.backButton.classList.remove("is-pressing");
  }

  elements.backButton.addEventListener("pointerdown", function (event) {
    if (event.button !== 0) {
      return;
    }
    startBackPress();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
    elements.backButton.addEventListener(eventName, endBackPress);
  });

  elements.backButton.addEventListener("click", function (event) {
    if (suppressKeyboardClick && event.detail === 0) {
      return;
    }
    if (longPressTriggered) {
      longPressTriggered = false;
      return;
    }
    goBack();
  });

  elements.backButton.addEventListener("keydown", function (event) {
    if (!["Enter", " "].includes(event.key) || event.repeat) {
      return;
    }
    event.preventDefault();
    keyboardPressActive = true;
    startBackPress();
  });

  elements.backButton.addEventListener("keyup", function (event) {
    if (!["Enter", " "].includes(event.key) || !keyboardPressActive) {
      return;
    }
    event.preventDefault();
    const wasLongPress = longPressTriggered;
    keyboardPressActive = false;
    endBackPress();
    suppressKeyboardClick = true;
    window.setTimeout(function () {
      suppressKeyboardClick = false;
    }, 0);

    if (wasLongPress) {
      longPressTriggered = false;
      return;
    }
    goBack();
  });

  render();
})(typeof globalThis !== "undefined" ? globalThis : window);
