import { useEffect, useState } from 'react';
import { getPreferredLocale, pickLocale } from '@/lib/locale';

const WECHAT_NAME = '计算机魔术师';

async function copyText(text: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function AuthorWechatLink() {
  const locale = getPreferredLocale();
  const [status, setStatus] = useState<'idle' | 'copied' | 'fallback'>('idle');

  useEffect(() => {
    if (status === 'idle') return undefined;
    const timer = window.setTimeout(() => setStatus('idle'), 2600);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function handleCopy() {
    try {
      await copyText(WECHAT_NAME);
      setStatus('copied');
    } catch {
      setStatus('fallback');
    }
  }

  return (
    <>
      <button
        aria-label={pickLocale({ zh: '复制计算机魔术师公众号名称', en: 'Copy WeChat account name' }, locale)}
        className="author-wechat-link"
        onClick={handleCopy}
        type="button"
      >
        {pickLocale({ zh: '点击一键关注『', en: 'Copy and follow 『' }, locale)}
        <span className="author-wechat-link__name">{WECHAT_NAME}</span>
        』
      </button>
      {status !== 'idle' ? (
        <span className="author-copy-toast" role="status">
          {status === 'copied'
            ? pickLocale(
                {
                  zh: '已复制公众号名称，请在微信内搜索关注',
                  en: 'Copied. Search this name in WeChat to follow.',
                },
                locale,
              )
            : pickLocale(
                {
                  zh: '请手动在微信搜索公众号：计算机魔术师',
                  en: 'Please search this name in WeChat: 计算机魔术师',
                },
                locale,
              )}
        </span>
      ) : null}
    </>
  );
}
