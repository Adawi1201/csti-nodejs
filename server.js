const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DB_FILE = path.join(__dirname, 'results.json');
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');

app.post('/api/submit', (req, res) => {
    try {
        const resultData = req.body;
        resultData.timestamp = new Date().toISOString();
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        data.push(resultData);
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        console.log(`收到新测试结果: ${resultData.type}`);
        res.status(200).json({ success: true, message: '数据已记录' });
    } catch (error) {
        console.error('保存数据失败:', error);
        res.status(500).json({ success: false, message: '服务器内部错误' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 CSTI 测试系统已启动: http://localhost:${PORT}`);
});