<<<<<<< HEAD
<<<<<<< HEAD
# 視光預約系統

這是一個使用 Next.js、Firebase 和 ShadCN UI 建立的現代化預約系統。

## 核心功能

-   **線上預約：** 顧客可以輕鬆選擇日期、時間和服務項目來進行預約。
-   **管理員後台：** 提供安全的登入機制，讓管理員可以查看、篩選和管理所有預約。
-   **即時通知：** 當有新的預約時，系統會自動發送通知到指定的 Discord 頻道。
-   **行動裝置優化：** 介面在電腦和手機上都有良好的瀏覽體驗。

## 開始使用

1.  **安裝依賴套件：**
    ```bash
    npm install
    ```

2.  **設定環境變數：**
    *   複製專案中的 `.env.example` 檔案，並將其重新命名為 `.env`。
    *   打開 `.env` 檔案，並填入您自己的 Firebase 和 Discord 設定值。您需要填寫以下變數：
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
        *   `DISCORD_WEBHOOK_URL` (此為選填)

3.  **啟動開發伺服器：**
    ```bash
    npm run dev
    ```

現在，您可以在瀏覽器中開啟 `http://localhost:3000` 來查看網站。

## 部署與交付 (賣斷模式)

這套系統非常適合以「賣斷」模式交付給客戶。此模式的核心是將整套系統安裝在客戶自己的雲端帳號下，讓他們擁有完整所有權，且後續營運成本極低。

### 建議交付流程

考量到您的客戶可能不熟悉技術設定，我們推薦以下流程，讓整個交付過程對客戶來說最為輕鬆：

1.  **為客戶建立專屬 Google 帳號：**
    *   建立一個新的、專門用於此專案的 Google 帳號 (例如：`客戶的店名.booking@gmail.com`)。
    *   這個帳號將用來管理所有相關的雲端服務。

2.  **使用新帳號建立 Firebase 專案：**
    *   登入 Firebase (firebase.google.com)，使用上一步建立的新帳號。
    *   建立一個新的 Firebase 專案，並選擇免費的 `Spark` 方案。

3.  **取得 Firebase 設定金鑰：**
    *   在 Firebase 專案中，前往「專案設定」(Project Settings) > 「一般」(General)。
    *   在「您的應用程式」(Your apps) 區塊，如果還沒有網頁應用程式，請註冊一個新的。
    *   您會在這裡找到所需的 `apiKey`、`authDomain` 和 `projectId`。

4.  **取得 Discord Webhook (若客戶需要)：**
    *   請客戶提供一個他 Discord 伺服器的 Webhook 網址，或透過螢幕分享引導他建立。

5.  **設定 `.env` 檔案：**
    *   將上述取得的所有金鑰，填入到專案的 `.env` 檔案中對應的欄位。

6.  **將專案從開發環境下載到您的電腦 (全新、更簡單的教學)**

    我們將採用最直接的方式來下載專案。**請忽略之前關於「...」按鈕的說明**，我們來試試這個方法：

    1.  **確保檔案總管已開啟**：
        *   點擊您畫面最左邊、像兩張紙重疊的圖示 (📄)，確認左邊的檔案列表是可見的。(您之前的截圖顯示這一步已經做對了！)

    2.  **在空白處按下滑鼠右鍵**：
        *   在檔案列表（也就是顯示 `.idx`, `.next`, `src` 等資料夾的地方）的**空白區域**，按一下您的**滑鼠右鍵**。
        *   這時會跳出一個新的選單。

    3.  **選擇「Download」**：
        *   在這個剛剛跳出的選單中，尋找並點擊「**Download...**」或「**下載...**」的選項。
        *   您的瀏覽器接著就會開始下載一個包含所有專案程式碼的 `.zip` 壓縮檔。

7.  **解壓縮檔案**

    1.  您的瀏覽器將會下載一個名為 `專案名稱.zip` 的壓縮檔。
    2.  下載完成後，請在您的電腦上**解壓縮**這個檔案。您會得到一個包含所有程式碼的資料夾。

    完成這個步驟後，您就擁有了一份本地的程式碼，可以接著進行下一步「上傳到 GitHub」了。

8.  **將專案上傳到 GitHub (零基礎指南)：**
    *   **為何需要這一步？** 這是為了讓 Firebase 能夠自動抓取您的程式碼並進行部署。您可以把它想像成將程式碼備份到一個私密的雲端硬碟。
    *   **第一步：在 GitHub 網站上建立一個空的儲存庫**
        1.  登入您的 [GitHub](https://github.com) 帳號。
        2.  點擊右上角的「+」號，選擇 "New repository"。
        3.  **Repository name (儲存庫名稱):** 您可以取一個好記的名字，例如 `booking-system`。
        4.  **Description (描述):** 這部分可以留空。
        5.  **將儲存庫設為「Private (私人)」**。這很重要，可以確保您的程式碼不會被公開。
        6.  **不要**勾選任何 "Initialize this repository with..." 的選項（例如 `README` 或 `.gitignore`），因為我們的專案裡已經有這些檔案了。
        7.  點擊綠色的 "Create repository" 按鈕。
    *   **第二步：從您的電腦上傳程式碼**
        1.  建立好儲存庫後，GitHub 會顯示一個頁面，標題是 "...or push an existing repository from the command line"。我們需要的就是這裡的指令。
        2.  請在您的開發工具中（例如 Windows 的 Terminal 或 macOS 的終端機），**進入您剛剛解壓縮的那個專案資料夾**。
        3.  **依序複製並貼上**以下每一行指令，每貼上一行就按一次 Enter 執行。這些指令會為您的專案建立一個本地的版本控制：
            ```bash
            git init
            git add .
            git commit -m "Initial commit: My booking system"
            git branch -M main
            ```
        4.  接下來，請回到您剛剛在 GitHub 建立儲存庫的頁面，複製那裡提供的**最後兩行指令**。它看起來會像這樣 (您的使用者名稱和專案名稱會不同)：
            ```bash
            git remote add origin https://github.com/您的使用者名稱/booking-system.git
            git push -u origin main
            ```
        5.  執行完最後一個指令後，您的所有程式碼就成功上傳到 GitHub 了！現在您可以回到 Firebase 繼續部署流程。

9.  **部署應用程式 (兩種方式)：**

    *   **方式一：透過 Firebase 控制台 (最簡單、推薦)**

        **第一步：進入 App Hosting 頁面**

        1.  登入您的 [Firebase 控制台](https://console.firebase.google.com/)。
        2.  點擊進入您的「視光預約系統」專案。
        3.  在左側的選單中，找到「**建構 (Build)**」這個類別，點擊它。
        4.  在展開的選單中，點擊「**應用程式寄存 (App Hosting)**」。

        **第二步：升級專案以啟用功能 (一次性設定)**

        1.  **您會看到一個提示，要求您「升級專案」到 Blaze 方案。**
        2.  **請放心點擊「升級專案」。**
            *   **為什麼要這樣做？** App Hosting 是 Firebase 的一項進階服務，啟用它的「門票」就是將帳號升級到 Blaze 方案。
            *   **會被收錢嗎？** **不會。** 只要您的網站用量沒有超過 Firebase 每月提供的**非常充裕的免費額度**，您的帳單金額就**永遠會是 0 元**。這一步只是為了「解鎖」功能。
        3.  按照畫面指示，完成付款資訊的綁定。

        **第三步：建立後端並連結 GitHub**

        1.  升級完成後，您會回到 App Hosting 頁面。現在，您應該會看到一個藍色的「**建立後端 (Create backend)**」或「**開始使用 (Get started)**」按鈕。請點擊它。
        2.  **連結 GitHub 帳戶：**
            *   系統會跳出一個視窗，要求您授權 Firebase 存取您的 GitHub 帳號。請點擊「**授權 (Authorize)**」。
            *   您可能會被引導到 GitHub 網站，請登入並確認授權。
        3.  **選擇您的專案儲存庫：**
            *   授權成功後，Firebase 會列出您 GitHub 帳號下的所有儲存庫。
            *   從列表中，找到並選擇您之前建立的那個儲存庫 (例如 `booking-system`)。
        4.  **設定部署資訊：**
            *   **部署區域 (Region):** 系統會請您選擇一個伺服器位置。您可以選擇離您的主要客戶群最近的區域，例如 `asia-east1` (台灣/香港) 或 `asia-northeast1` (東京)。這有助於加快網站速度。
            *   **部署分支 (Deployment branch):** 這裡通常會自動填入 `main`。保持預設值即可。
            *   **自動部署 (Automatic rollouts):** 確保這個選項是**打勾**的。這就是神奇的地方：未來只要您將新的程式碼更新到 GitHub 的 `main` 分支，Firebase 就會自動幫您重新部署網站。
        5.  **點擊「完成設定 (Finish and deploy)」。**

        **第四步：等待部署完成**

        *   現在，您唯一要做的就是等待！Firebase 會開始執行一系列的自動化流程：
            1.  從您的 GitHub 抓取最新的程式碼。
            2.  在雲端進行建置 (就像在您電腦上執行 `npm run build`)。
            3.  將建置好的網站部署到全球網路上。
        *   這個過程通常需要 2 到 5 分鐘。您可以在畫面上看到部署的進度。

        **第五步：您的網站正式上線！**

        *   當部署狀態顯示為「**成功 (Success)**」或「**已上線 (Live)**」時，就大功告成了！
        *   在同一個頁面上，您會看到一個**預設網址**，格式通常是 `您的專案ID.web.app`。
        *   點擊這個網址，您就可以看到您熱騰騰、正式上線的預約系統了！

    *   **方式二：使用 Firebase CLI (適合開發者)**
        1.  在您的電腦上安裝 Firebase CLI。
        2.  在專案根目錄執行 `firebase login` 登入。
        3.  執行 `firebase init hosting` 並選擇您的 Firebase 專案。
        4.  執行 `npm run build` 來建置您的應用程式。
        5.  最後，執行 `firebase deploy` 來完成部署。

10. **交付網址與帳號給客戶：**
    *   部署完成後，在 Firebase 的「App Hosting」頁面，您會找到一個**預設網址** (例如：`專案ID.web.app`)。
    *   **(建議)** 引導客戶在 Firebase 控制台中「**新增自訂網域**」，將網站綁定到他們自己的專業網址上 (例如 `booking.客戶的店名.com`)。
    *   最後，將專屬的 Google 帳號和密碼，連同網站網址一起交付給客戶。
    *   請客戶立即登入並**更改密碼**，確保帳號安全。

完成後，客戶就擁有了一套完全屬於他自己、獨立運作的預約系統。您也完成了交付，不需再經手客戶的敏感資料。
=======
# mybooking2
>>>>>>> 459c3b5377040fc723a401d0838efaa4989d9a74
=======
# mybooking2
這是您本地的 README 內容
>>>>>>> f55f0f74269ac64fbcfa492fdb78b3522d671eaa
