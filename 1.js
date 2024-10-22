const { width, getRandomNumber, centerTextWithBorders, colors, printDivider, countdown, centerTextmrhuang_ascii, mrhuang_ascii, infoMessages } = require('./0');
const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');



// 辅助
// -----------------------------------------------------------------------------------------------------
const failedIds = new Set();
const maxConcurrentThreads = 5; // 线程数
let currentIndex = 0; // 

const maxRetries = 3; // 最大重试次数


async function getIdsAndHashesFromJson() {
    try {
        const jsonContent = await fs.readFile('data/1.json', 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        const idsAndHashes = jsonData.data.map(item => ({ id: item.id, hash: item.hash }));
        return idsAndHashes;
    } catch (error) {
        console.log(`${colors.green}${centerTextWithBorders('读取JSON文件出错', width)}${colors.reset}`);
        throw error;
    }
}


// 生成
async function generateHashCode(t, collectSeqNo) {
    const data = `${t}${collectSeqNo}7be2a16a82054ee58398c5edb7ac4a5a`;
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
}

// 请求
// ----------------------------------------------------------------------------------------------------
// 获取token
async function post1(query_id) {
    try {
        const apiUrl = `https://api.freedogs.bot/miniapps/api/user/telegram_auth?invitationCode=&initData=${query_id}`;
        const data = `invitationCode=&initData=${query_id}`;
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://app.freedogs.bot',
            'Pragma': 'no-cache',
            'Priority': 'u=1, i',
            'Referer': 'https://app.freedogs.bot/',
            'Sec-Ch-Ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        };
        const response = await axios.post(apiUrl, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ----------------------------------------------------------------------------------------------------

// 获取信息
async function get1(url, token) {
    try {
        const headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'authorization': `Bearer ${token}`,
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://app.freedogs.bot',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': 'https://app.freedogs.bot/',
            'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// 公共，点击，任务
async function post2(url, token, data) {
    try {
        const headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'authorization': `Bearer ${token}`,
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://app.freedogs.bot',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': 'https://app.freedogs.bot/',
            'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'sec-ch-ua-mobile': '?0',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        };
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ----------------------------------------------------------------------------------------------------

let totalEarn = 0;

async function processId(id, hash, threadNumber) {
    let token = '';
    let collectSeqNo = '';
    let coinPoolLeft = '';

    // ----------------------------------------------------------------------------------------------------


    try {
        console.log(`${colors.red}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 开始任务 `, width)}${colors.reset}`);
        // ----------------------------------------------------------------------------------------------------


        // 获取token
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线

        for (let attempts = 0; attempts < maxRetries; attempts++) {
            try {

                const data1 = await post1(hash);
                token = data1.data.token;

                console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取token成功 `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 用户 ID: ${data1.data.userExtraInfoItem.telegramID} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` IP 地址: ${data1.data.userExtraInfoItem.iPAddress} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 邀请码: ${data1.data.userExtraInfoItem.InvitationCode} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 推荐人 ID: ${data1.data.userExtraInfoItem.referredBy} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 推荐码: ${data1.data.userExtraInfoItem.referredByCode} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 用户语言: ${data1.data.userExtraInfoItem.language} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 服务器版本: ${data1.data.userExtraInfoItem.serverVersion} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 好友数量: ${data1.data.userExtraInfoItem.friendCount} `, width)}${colors.reset}`);


                break; // 成功后退出循环
            } catch (error) {
                console.error(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取token失败, 第 ${attempts + 1}/${maxRetries}次尝试, ${error.message}`, width)}${colors.reset}`);
                if (attempts === maxRetries - 1) {

                    console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
                    return; // 跳过尝试失败的 ID
                }

                await countdown(3);

                console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
            }
        }



        // 获取信息
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线

        for (let attempts = 0; attempts < maxRetries; attempts++) {
            try {

                const url2 = 'https://api.freedogs.bot/miniapps/api/mine/getMineInfo?';
                const data2 = await get1(url2, token);

                console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取信息成功 `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 矿工速度: ${data2.data.mineSpeed} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 好友矿工加成: ${data2.data.frensMineBoost} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 每币价值: ${data2.data.valuePerCoin} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 获得币数: ${data2.data.getCoin} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 获得矿币: ${data2.data.getMineCoin} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 离线币数: ${data2.data.offlineCoin} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 更新时间: ${data2.data.updateTime} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 下一次更新时间: ${data2.data.nextUpdateTime} `, width)}${colors.reset}`);


                break; // 成功后退出循环
            } catch (error) {
                console.error(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取信息失败, 第 ${attempts + 1}/${maxRetries}次尝试, ${error.message}`, width)}${colors.reset}`);
                if (attempts === maxRetries - 1) {

                    console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
                    return; // 跳过尝试失败的 ID
                }

                await countdown(3);

                console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
            }
        }


        // 获取信息
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线

        for (let attempts = 0; attempts < maxRetries; attempts++) {
            try {

                const url3 = 'https://api.freedogs.bot/miniapps/api/user_game_level/GetGameInfo?';
                const data3 = await get1(url3, token);
                collectSeqNo = data3.data.collectSeqNo;
                coinPoolLeft = data3.data.coinPoolLeft;
                totalEarn += Number(data3.data.totalEarn);

                console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取用户信息成功 `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 用户 ID: ${data3.data.userId} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 币种掉落速度: ${data3.data.coinFallSpeed} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 收集币间隔: ${data3.data.collectCoinInterval} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 币池限制: ${data3.data.coinPoolLimit} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 币池剩余: ${data3.data.coinPoolLeft} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 币池等级: ${data3.data.coinPoolLevel} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 币池升级成本: ${data3.data.coinPoolUpgradeCost} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 币池恢复速度: ${data3.data.coinPoolRecoverySpeed} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 收集序列号: ${data3.data.collectSeqNo} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 当前金额: ${data3.data.currentAmount} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 每小时功率: ${data3.data.perHourPower} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 总收入: ${data3.data.totalEarn} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 排名: ${data3.data.rankNumber} `, width)}${colors.reset}`);


                break; // 成功后退出循环
            } catch (error) {
                console.error(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取用户信息失败, 第 ${attempts + 1}/${maxRetries}次尝试, ${error.message}`, width)}${colors.reset}`);
                if (attempts === maxRetries - 1) {

                    console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
                    break; // 跳过尝试失败的 ID
                }

                await countdown(3);

                console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
            }
        }



        // 点击
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线

        for (let attempts = 0; attempts < maxRetries; attempts++) {
            try {

                const collectAmount = coinPoolLeft;
                const hashCode = await generateHashCode(collectAmount, collectSeqNo);
                const url4 = 'https://api.freedogs.bot/miniapps/api/user_game/collectCoin';
                const data = {
                    collectAmount,
                    hashCode,
                    collectSeqNo
                };
                const data4 = await post2(url4, token, data);

                console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 点击成功 `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 收集金额: ${data4.data.collectAmount} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 收集状态: ${data4.data.collectStatus ? '成功' : '失败'} `, width)}${colors.reset}`);
                console.log(`${colors.green}${centerTextWithBorders(` 收集序列号: ${data4.data.collectSeqNo} `, width)}${colors.reset}`);


                break; // 成功后退出循环
            } catch (error) {
                console.error(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 点击失败, 第 ${attempts + 1}/${maxRetries}次尝试, ${error.message}`, width)}${colors.reset}`);
                if (attempts === maxRetries - 1) {

                    console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
                    break; // 跳过尝试失败的 ID
                }

                await countdown(3);

                console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
            }
        }


        // 任务
        // console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线

        // for (let attempts = 0; attempts < maxRetries; attempts++) {
        //     try {

        //         const url5 = 'https://api.freedogs.bot/miniapps/api/task/lists?';
        //         const data5 = await get1(url5, token);


        //         console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 获取任务信息成功 `, width)}${colors.reset}`);
        //         // 打印详细任务信息
        //         console.log(`${colors.green}${centerTextWithBorders(" 任务列表: ", width)}${colors.reset}`);
        //         const incompleteTaskIds = [];
        //         if (data5 && data5.data && data5.data.lists && Array.isArray(data5.data.lists)) {
        //             data5.data.lists.forEach(task => {
        //                 console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        //                 console.log(`${colors.green}${centerTextWithBorders(` 任务 ID: ${task.id} `, width)}${colors.reset}`);
        //                 console.log(`${colors.green}${centerTextWithBorders(` 任务名称: ${task.name} `, width)}${colors.reset}`);
        //                 console.log(`${colors.green}${centerTextWithBorders(` 奖励: ${task.rewardParty} `, width)}${colors.reset}`);
        //                 console.log(`${colors.green}${centerTextWithBorders(` 状态: ${task.isFinish === 1 ? '已完成' : '未完成'} `, width)}${colors.reset}`);
        //                 if (task.isFinish === 0) {
        //                     incompleteTaskIds.push(task.id);
        //                 }
        //             });


        //             // 对每个未完成的任务 ID 发送请求
        //             for (const taskId of incompleteTaskIds) {
        //                 console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        //                 for (let attempts = 0; attempts < maxRetries; attempts++) {
        //                     try {
        //                         const url6 = 'https://api.freedogs.bot/miniapps/api/task/finish_task';
        //                         const data = { id: taskId };
        //                         const data6 = await post2(url6, token, data);

        //                         console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 任务成功 `, width)}${colors.reset}`);
        //                         console.log(`${colors.green}${centerTextWithBorders(` 任务 ID: ${taskId} `, width)}${colors.reset}`);
        //                         console.log(`${colors.green}${centerTextWithBorders(` 响应消息: ${data6.msg} `, width)}${colors.reset}`);


        //                         break; // 成功后退出循环
        //                     } catch (error) {
        //                         console.error(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 任务失败, 第 ${attempts + 1}/${maxRetries}次尝试, ${error.message}`, width)}${colors.reset}`);
        //                         if (attempts === maxRetries - 1) {

        //                             console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
        //                             break; // 跳过尝试失败的 ID
        //                         }

        //                         await countdown(3);

        //                         console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
        //                     }
        //                 }
        //             }
        //         } else {
        //             console.log(`${colors.yellow}${centerTextWithBorders("没有任务数据", width)}${colors.reset}`);
        //         }

        //         break; // 成功后退出循环
        //     } catch (error) {
        //         console.error(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 点击失败, 第 ${attempts + 1}/${maxRetries}次尝试, ${error.message}`, width)}${colors.reset}`);
        //         if (attempts === maxRetries - 1) {

        //             console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
        //             break; // 跳过尝试失败的 ID
        //         }

        //         await countdown(3);

        //         console.log(`${colors.blue}${printDivider(width)}${colors.reset}`);
        //     }
        // }






        // ----------------------------------------------------------------------------------------------------

        console.log(`${colors.red}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id} 结束任务 `, width)}${colors.reset}`);
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
    } catch (error) {
        console.log(`${colors.blue}${centerTextWithBorders(` 线程 ${threadNumber}: id为${id}的请求报错: ${error.message}`, width)}${colors.reset}`);
        failedIds.add(id); // 将失败的 ID 添加到集合中
    }
}



// ----------------------------------------------------------------------------------------------------


// 处理线程
async function handleThread(threadNumber, idsAndHashes) {
    while (true) {
        const index = currentIndex++;
        if (index >= idsAndHashes.length) {
            break;
        }

        const { id, hash } = idsAndHashes[index];
        await processId(id, hash, threadNumber);
    }
}

async function main() {
    let loopCount = 0;
    while (true) {

        loopCount++;
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        console.log(`${colors.cyan}${centerTextmrhuang_ascii(mrhuang_ascii, width)}${colors.reset}`);
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        console.log(`${colors.green}${centerTextWithBorders(" FreeDogs批量脚本 ", width)}${colors.reset}`);
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        infoMessages.forEach(message => {
            console.log(`${colors.blue}${centerTextWithBorders(message, width)}${colors.reset}`);
        });
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        console.log(`${colors.blue}${centerTextWithBorders(` 开启: ${maxConcurrentThreads} 线程 `, width)}${colors.reset}`);
        console.log(`${colors.blue}${centerTextWithBorders(` 正在执行第: ${loopCount} 次循环 `, width)}${colors.reset}`);
        console.log(`${colors.blue}${centerTextWithBorders(" 程序正在执行请等待3秒时间", width)}${colors.reset}`);
        await countdown(3);
        console.log(`${colors.blue}${printDivider(width)}${colors.reset}`); // 分割线
        // ----------------------------------------------------------------------------------------------------
        // failedIds.clear();
        const idsAndHashes = await getIdsAndHashesFromJson();
        const threadPromises = [];
        for (let i = 0; i < maxConcurrentThreads; i++) {
            threadPromises.push(handleThread(i + 1, idsAndHashes));
        }

        await Promise.all(threadPromises);

        currentIndex = 0;
        console.log(`${colors.blue}${centerTextWithBorders(' 所有任务完成 ', width)}${colors.reset}`);

        console.log(`${colors.red}${centerTextWithBorders(` 总数量: ${totalEarn} `, width)}${colors.reset}`);

        totalEarn = 0; // 总收益
        const randomNumber = await getRandomNumber(10, 20);
        console.log(`${colors.blue}${centerTextWithBorders(` 重新开始,等待时间: ${randomNumber} 秒 `, width)}${colors.reset}`);
        await countdown(randomNumber);
    }
}


// 执行主函数
main();