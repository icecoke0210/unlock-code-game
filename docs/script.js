document.addEventListener('DOMContentLoaded', function() {
    // 遊戲元素
    const currentGuessElement = document.getElementById('current-guess');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    const keyButtons = document.querySelectorAll('.key');
    const guessHistoryElement = document.getElementById('guess-history');
    const resultModal = document.getElementById('result-modal');
    const resultMessageElement = document.getElementById('result-message');
    const secretCodeElement = document.getElementById('secret-code');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    // 遊戲變數
    let secretCode = [];
    let currentGuess = [];
    let guessCount = 0;
    let usedDigits = new Set();
    
    // 初始化遊戲
    initGame();
    
    // 按鍵事件處理
    keyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const digit = button.getAttribute('data-value');
            if (currentGuess.length < 3 && !usedDigits.has(digit)) {
                currentGuess.push(digit);
                usedDigits.add(digit);
                button.disabled = true;
                updateDisplay();
            }
        });
    });
    
    // 確認按鈕
    submitBtn.addEventListener('click', () => {
        checkGuess();
    });
    
    // 清除按鈕
    clearBtn.addEventListener('click', () => {
        clearCurrentGuess();
    });
    
    // 再玩一次按鈕
    playAgainBtn.addEventListener('click', () => {
        resultModal.style.display = 'none';
        initGame();
    });
    
    // 初始化遊戲
    function initGame() {
        secretCode = generateSecretCode();
        currentGuess = [];
        guessCount = 0;
        usedDigits.clear();
        guessHistoryElement.innerHTML = '';
        currentGuessElement.textContent = '';
        enableAllKeyButtons();
        submitBtn.disabled = true;
        
        console.log('秘密碼: ', secretCode.join('')); // 開發用，可以註解掉
    }
    
    // 生成秘密碼（3個不重複的數字）
    function generateSecretCode() {
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        // 隨機排序數字
        for (let i = digits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [digits[i], digits[j]] = [digits[j], digits[i]];
        }
        
        // 取前3個數字
        return digits.slice(0, 3).map(String);
    }
    
    // 更新顯示
    function updateDisplay() {
        currentGuessElement.textContent = currentGuess.join('');
        submitBtn.disabled = currentGuess.length !== 3;
    }
    
    // 啟用所有按鍵
    function enableAllKeyButtons() {
        keyButtons.forEach(button => {
            button.disabled = false;
        });
    }
    
    // 清除當前猜測
    function clearCurrentGuess() {
        usedDigits.clear();
        currentGuess = [];
        enableAllKeyButtons();
        updateDisplay();
    }
    
    // 檢查猜測
    function checkGuess() {
        guessCount++;
        
        let a = 0;
        let b = 0;
        
        // 計算A和B
        currentGuess.forEach((digit, index) => {
            if (digit === secretCode[index]) {
                a++;
            } else if (secretCode.includes(digit)) {
                b++;
            }
        });
        
        // 添加到歷史記錄
        addToHistory(currentGuess.join(''), a, b);
        
        // 檢查是否猜對
        if (a === 3) {
            showResultModal(true);
        }
        
        // 清除當前猜測
        clearCurrentGuess();
    }
    
    // 添加到歷史記錄
    function addToHistory(guess, a, b) {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        const guessNumberElement = document.createElement('div');
        guessNumberElement.classList.add('guess-number');
        guessNumberElement.textContent = guess;
        
        const guessResultElement = document.createElement('div');
        guessResultElement.classList.add('guess-result');
        guessResultElement.textContent = `${a}A${b}B`;
        
        historyItem.appendChild(guessNumberElement);
        historyItem.appendChild(guessResultElement);
        
        guessHistoryElement.prepend(historyItem);
    }
    
    // 顯示結果彈窗
    function showResultModal(isWin) {
        if (isWin) {
            const encouragingMessages = [
                '太厲害了！你成功解開了密碼鎖！',
                '恭喜你！你的推理能力真強！',
                '完美破解！你的表現令人驚嘆！',
                '出色的表現！你成功解開了密碼！',
                '太棒了！你是解密高手！'
            ];
            
            const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
            resultMessageElement.textContent = encouragingMessages[randomIndex];
            secretCodeElement.textContent = `密碼是: ${secretCode.join('')}，你猜了 ${guessCount} 次`;
        }
        
        resultModal.style.display = 'block';
    }
});
