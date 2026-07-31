const https = require('https');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(data);
    const r = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': b.length, 'Accept': 'application/json' }
    });
    r.write(b);
    r.on('response', res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
    r.on('error', reject);
    r.end();
  });
}

async function main() {
  const dev = await post('https://github.com/login/device/code', {
    client_id: '178c6fc778ccc68e1d6a',
    scope: 'repo,workflow,read:org,user'
  });

  console.log('');
  console.log('========================================');
  console.log('  验证码: ' + dev.user_code);
  console.log('  打开: https://github.com/login/device');
  console.log('  输入验证码 -> Continue -> Authorize');
  console.log('========================================');
  console.log('');
  console.log('完成后本窗口会自动继续...');
  console.log('');

  const interval = Math.max(dev.interval || 5, 5);
  const start = Date.now();

  while (Date.now() - start < 600000) {
    await new Promise(r => setTimeout(r, interval * 1000));
    try {
      const tok = await post('https://github.com/login/oauth/access_token', {
        client_id: '178c6fc778ccc68e1d6a',
        device_code: dev.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
      });
      if (tok.access_token) {
        console.log('授权成功！');
        require('fs').writeFileSync(process.env.APPDATA + '/GitHub CLI/gh_token.txt', tok.access_token, 'utf8');
        console.log('令牌已保存，可以关闭本窗口了。');
        return;
      }
      if (tok.error === 'authorization_pending') continue;
      if (tok.error === 'slow_down') continue;
      console.log('错误: ' + tok.error);
      return;
    } catch (e) { /* retry */ }
  }
  console.log('等待超时，请重新运行 auth.bat');
}

main().catch(console.error);
