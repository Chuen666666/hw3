# 過年親戚聚會好幫手

親戚關係繞口又難記？「過年親戚聚會好幫手」可以按照關係順序，快速找出正確的中文親屬稱謂，拜年時不再擔心叫錯人。

## 功能特色

- 依照親屬關係逐步輸入，快速取得稱謂。
- 提供男、女兩種視角，處理不同的親屬稱呼。
- 支援父母、兄弟姊妹、配偶、子女與長幼關係。
- 可隨時返回上一步，也能長按返回一次清除整條關係。
- 支援電腦、平板與手機操作。
- 不需要註冊，也不會蒐集個人資料。

## 使用方式

1. 先選擇「我（男）」或「我（女）」。
2. 按照題目的順序，依次選擇親屬關係。
3. 按下 `=` 查看稱謂答案。
4. 按錯時短按「返回」撤銷一步；長按「返回」可全部清除。

## 詳細操作流程

```mermaid
flowchart TD
    START(["開啟網站"]) --> SELECT["必須先選擇「我（男）」或「我（女）」<br/>未選擇時，關係按鈕與等號維持停用"]
    SELECT --> RESET["設定所選視角<br/>清除關係、結果與返回歷史"]
    RESET --> ENABLE["啟用 12 個關係按鈕與等號"]
    ENABLE --> ACTION{"選擇下一個操作"}

    ACTION -- "改選視角" --> SELECT

    ACTION -- "按關係按鈕" --> SAVE_REL["把目前狀態存入返回歷史"]
    SAVE_REL --> APPEND["加入一個關係步驟"]
    APPEND --> CLEAR_RESULT["清除上一個計算結果"]
    CLEAR_RESULT --> RENDER_STATE["依目前完整狀態重新渲染<br/>關係路徑、步數與結果區"]
    RENDER_STATE --> ACTION

    ACTION -- "按等號" --> SAVE_EQ["把目前狀態存入返回歷史"]
    SAVE_EQ --> HAS_STEP{"是否至少輸入一個關係？"}
    HAS_STEP -- "否" --> EMPTY_ERROR["顯示「請先輸入至少一個親屬關係」"]
    HAS_STEP -- "是" --> VALID_STEPS{"所有關係代碼是否都存在於 RELATION_LABELS？"}
    VALID_STEPS -- "否" --> INVALID_STEP["顯示「輸入中包含無效的親屬關係」<br/>錯誤代碼：invalid-step"]
    VALID_STEPS -- "是" --> LOAD_GRAPH["依所選視角建立或讀取親屬圖"]
    LOAD_GRAPH --> ROOT_NODE["從親屬圖的 root（我）節點開始"]
    ROOT_NODE --> RELATION_TYPE{"依序讀取下一個關係步驟"}

    RELATION_TYPE -- "爸爸或媽媽" --> PARENT_LINK["沿目前節點的 father 或 mother 連結"]
    RELATION_TYPE -- "哥哥、弟弟、姊姊或妹妹" --> SIBLING_LINK["在 siblings 排除本人並篩選指定性別<br/>依 birthOrder 尋找最接近的較年長或較年輕手足"]
    RELATION_TYPE -- "丈夫或妻子" --> SPOUSE_LINK["核對目前節點的性別與配偶方向<br/>符合後沿 spouse 連結取得男配偶或女配偶"]
    RELATION_TYPE -- "較年長或較年輕的兒子、女兒" --> CHILD_LINK["在 children 篩選指定性別並依 birthOrder 排序<br/>較年長取第一位，較年輕取最後一位"]

    PARENT_LINK --> LINK_FOUND{"是否取得符合條件的下一個節點？"}
    SIBLING_LINK --> LINK_FOUND
    SPOUSE_LINK --> LINK_FOUND
    CHILD_LINK --> LINK_FOUND
    LINK_FOUND -- "否" --> UNSUPPORTED["顯示「這個組合不在本次作業的親屬範圍內」"]
    LINK_FOUND -- "是" --> HAS_NEXT{"還有尚未處理的關係步驟？"}
    HAS_NEXT -- "是" --> RELATION_TYPE
    HAS_NEXT -- "否" --> SUCCESS["以成功樣式顯示最後節點的親屬稱謂"]
    EMPTY_ERROR --> SHOW_RESULT["更新結果區"]
    INVALID_STEP --> SHOW_RESULT
    SUCCESS --> SHOW_RESULT
    UNSUPPORTED --> SHOW_RESULT
    SHOW_RESULT --> ACTION

    ACTION -- "按返回" --> INPUT_TYPE{"使用哪種輸入？"}
    INPUT_TYPE -- "滑鼠或觸控" --> POINTER_DOWN["pointerdown 且為主要按鈕<br/>startBackPress() 啟動 700ms 計時"]
    POINTER_DOWN --> POINTER_WAIT{"700ms 內先發生哪個事件？"}
    POINTER_WAIT -- "pointerleave 或 pointercancel" --> POINTER_CANCEL["endBackPress()<br/>取消計時並移除按壓樣式，不執行返回"]
    POINTER_CANCEL --> ACTION
    POINTER_WAIT -- "pointerup" --> POINTER_UP["endBackPress()<br/>取消計時並移除按壓樣式"]
    POINTER_UP --> POINTER_CLICK["瀏覽器送出後續 click"]
    POINTER_CLICK --> LONG_CLICK{"longPressTriggered 是否為 true？"}
    LONG_CLICK -- "否，短按" --> HAS_HISTORY{"返回歷史是否有上一個狀態？"}
    LONG_CLICK -- "是，已長按" --> SUPPRESS_POINTER_CLICK["重設 longPressTriggered<br/>略過 goBack()，避免額外返回"]
    SUPPRESS_POINTER_CLICK --> ACTION

    INPUT_TYPE -- "Enter 或 Space" --> KEY_DOWN["keydown：阻止瀏覽器預設動作"]
    KEY_DOWN --> KEY_REPEAT{"event.repeat 或 keyboardPressActive？"}
    KEY_REPEAT -- "是" --> REPEAT_GUARD["忽略重複按鍵<br/>保留原計時，不重新啟動"]
    KEY_REPEAT -- "否" --> KEY_START["keyboardPressActive = true<br/>startBackPress() 啟動 700ms 計時"]
    REPEAT_GUARD --> KEY_WAIT{"計時器或 keyup 哪一個先發生？"}
    KEY_START --> KEY_WAIT
    KEY_WAIT -- "keyup，未滿 700ms" --> KEY_UP_SHORT["endBackPress() 並設定 suppressKeyboardClick<br/>呼叫 goBack()；後續 detail=0 click 會被忽略"]
    KEY_UP_SHORT --> HAS_HISTORY

    HAS_HISTORY -- "是" --> RESTORE["取出並還原上一個完整操作狀態<br/>可能還原關係步驟、計算結果或錯誤提示"]
    RESTORE --> RENDER_STATE
    HAS_HISTORY -- "否" --> NO_HISTORY["顯示「目前沒有可以返回的步驟」"]
    NO_HISTORY --> SHOW_RESULT

    POINTER_WAIT -- "計時器到達 700ms" --> LONG_TRIGGER["longPressTriggered = true"]
    KEY_WAIT -- "計時器到達 700ms" --> LONG_TRIGGER
    LONG_TRIGGER --> CLEAR_ALL["清除關係路徑、結果與返回歷史<br/>保留已選擇的視角並重新渲染"]
    CLEAR_ALL --> LONG_END{"長按輸入如何結束？"}
    LONG_END -- "pointerup" --> POINTER_UP
    LONG_END -- "keyup" --> KEY_UP_LONG["endBackPress()、重設 longPressTriggered<br/>設定 suppressKeyboardClick，不呼叫 goBack()"]
    KEY_UP_LONG --> SUPPRESS_KEY_CLICK["忽略後續 detail=0 合成 click<br/>下一輪事件循環重設 suppressKeyboardClick"]
    SUPPRESS_KEY_CLICK --> ACTION
```

## 操作範例

選擇「我（男）」後，依序按下「媽媽」、「爸爸」、「女兒（較年輕）」及 `=`，答案會顯示為「姨媽」。

## 使用提醒

本工具依課程作業指定的親屬範圍提供答案，不包含曾祖父母以上的關係或其他特殊稱謂。
