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
    START(["開啟網站"]) --> GENDER{"是否已選擇視角？"}

    GENDER -- "否" --> SELECT["選擇「我（男）」或「我（女）」"]
    SELECT --> RESET["建立新的空白查詢<br/>清除關係、結果與返回歷史"]
    RESET --> ENABLE["啟用 12 個關係按鈕與等號"]
    ENABLE --> ACTION{"選擇下一個操作"}
    GENDER -- "是" --> ACTION

    ACTION -- "改選視角" --> SELECT

    ACTION -- "按關係按鈕" --> SAVE_REL["把目前狀態存入返回歷史"]
    SAVE_REL --> APPEND["加入一個關係步驟"]
    APPEND --> CLEAR_RESULT["清除上一個計算結果"]
    CLEAR_RESULT --> RENDER_PATH["更新關係路徑與步數"]
    RENDER_PATH --> ACTION

    ACTION -- "按等號" --> SAVE_EQ["把目前狀態存入返回歷史"]
    SAVE_EQ --> HAS_STEP{"是否至少輸入一個關係？"}
    HAS_STEP -- "否" --> EMPTY_ERROR["顯示「請先輸入至少一個親屬關係」"]
    HAS_STEP -- "是" --> LOAD_GRAPH["依所選視角建立或讀取親屬圖"]
    LOAD_GRAPH --> FOLLOW["依序走訪每個關係<br/>保留性別、世代、婚姻方向與長幼資訊"]
    FOLLOW --> FOUND{"是否找到支援的親屬？"}
    FOUND -- "是" --> SUCCESS["以成功樣式顯示親屬稱謂"]
    FOUND -- "否" --> UNSUPPORTED["顯示超出作業範圍的提示"]
    EMPTY_ERROR --> SHOW_RESULT["更新結果區"]
    SUCCESS --> SHOW_RESULT
    UNSUPPORTED --> SHOW_RESULT
    SHOW_RESULT --> ACTION

    ACTION -- "按返回" --> INPUT_TYPE{"使用哪種輸入？"}
    INPUT_TYPE -- "滑鼠或觸控" --> HOLD_TIME{"持續按住約 700 毫秒？"}
    INPUT_TYPE -- "Enter 或 Space" --> REPEAT_GUARD["阻止瀏覽器預設動作<br/>忽略重複按鍵，不重啟計時"]
    REPEAT_GUARD --> HOLD_TIME

    HOLD_TIME -- "否，短按" --> HAS_HISTORY{"返回歷史是否有上一個狀態？"}
    HAS_HISTORY -- "是" --> RESTORE["恢復上一個狀態"]
    RESTORE --> RENDER_PATH
    HAS_HISTORY -- "否" --> NO_HISTORY["顯示「沒有可返回的上一步」"]
    NO_HISTORY --> SHOW_RESULT

    HOLD_TIME -- "是，長按" --> CLEAR_ALL["清除關係路徑、結果與返回歷史<br/>保留已選擇的視角"]
    CLEAR_ALL --> RENDER_PATH
```

## 操作範例

選擇「我（男）」後，依序按下「媽媽」、「爸爸」、「女兒（較年輕）」及 `=`，答案會顯示為「姨媽」。

## 使用提醒

本工具依課程作業指定的親屬範圍提供答案，不包含曾祖父母以上的關係或其他特殊稱謂。
