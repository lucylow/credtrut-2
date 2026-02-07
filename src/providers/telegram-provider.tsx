import React, { createContext, useContext } from 'react';

const TelegramContext = createContext<any>(null);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  // Mocking Telegram Mini App Provider logic
  const mockTwa = {
    ready: () => console.log('TWA Ready'),
    expand: () => console.log('TWA Expanded'),
    close: () => console.log('TWA Closed'),
    initData: "user=%7B%22id%22%3A12345678%2C%22first_name%22%3A%22Mock%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22mockuser%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&chat_instance=87654321&chat_type=private&auth_date=1707312900&hash=mock_hash",
    initDataUnsafe: {
      user: {
        id: 12345678,
        first_name: "Mock",
        last_name: "User",
        username: "mockuser",
        language_code: "en",
        is_premium: true
      },
      chat_instance: "87654321",
      chat_type: "private",
      auth_date: 1707312900,
      hash: "mock_hash"
    },
    version: "7.0",
    platform: "tdesktop",
    colorScheme: "dark",
    themeParams: {
      bg_color: "#17212b",
      text_color: "#f5f5f5",
      hint_color: "#708499",
      link_color: "#6ab3f3",
      button_color: "#5288c1",
      button_text_color: "#ffffff",
      secondary_bg_color: "#232e3c"
    },
    MainButton: {
      text: 'Submit',
      color: "#5288c1",
      textColor: "#ffffff",
      isVisible: false,
      isActive: true,
      isProgressVisible: false,
      show: () => console.log('MainButton Shown'),
      hide: () => console.log('MainButton Hidden'),
      enable: () => {},
      disable: () => {},
      showProgress: () => {},
      hideProgress: () => {},
      onClick: (cb: any) => console.log('MainButton Click Registered')
    },
    BackButton: {
      isVisible: false,
      show: () => {},
      hide: () => {},
      onClick: (cb: any) => {}
    },
    HapticFeedback: {
      impactOccurred: (style: string) => console.log(`Haptic impact: ${style}`),
      notificationOccurred: (type: string) => console.log(`Haptic notification: ${type}`),
      selectionChanged: () => {}
    }
  };

  return (
    <TelegramContext.Provider value={mockTwa}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
