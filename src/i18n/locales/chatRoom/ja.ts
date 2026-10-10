import type ko from "./ko";

const ja: typeof ko = {
  chatRoom: {
    closedNotice:
      "キャラクターが削除されたため、これ以上会話できません。これまでの会話は引き続き見られます。",
    generatedNotice: "AIが生成した会話です。実在の人物や事実と異なる場合があります。",
    sidebar: {
      title: "チャットルーム設定",
      back: "戻る",
      openSettings: "チャットルーム設定を開く",
      close: "チャットルーム設定を閉じる",
      backToSettings: "チャットルーム設定に戻る",
      ownedNotes: "保有ノート",
      userSettings: "ユーザー設定",
      memoryLog: "メモリーログ",
      chatSettings: "チャット環境設定",
      memory: "過去の会話",
      pastConversations: "過去の会話",
      memoryDescription:
        "会話を自動で要約し、キャラクターがより長く記憶できます。",
      memoryPlaceholder:
        "これまでの会話の中で覚えておいてほしい内容を書いてください",
      memorySaveButton: "保存",
      memorySavedToast: "長期記憶が保存されました",
      memoryTurn: "ターン {turn}",
      editMemory: "長期記憶を編集",
      memoryCancelButton: "キャンセル",
      memoryEmpty: "まだ記憶した会話がありません",
      persona: "ペルソナ",
      userNote: "ユーザーノート",
      assetGallery: "アセットギャラリー",
      assetGalleryEmpty: "まだアセットがありません",
      assetTotal: "合計  {count}件",
      suggestedReply: "おすすめ返信",
      novelView: "小説で見る",
      assetView: "アセット表示",
      assetLocked: "ロックされたアセット",
      backToAssetGallery: "アセットギャラリーに戻る",
      responseLength: "返信の長さ",
      responseLengthShort: "短め",
      responseLengthMedium: "標準",
      responseLengthLong: "長め",
      responseLengthShortDescription: "クレジットを節約して、キャラクターと長くチャットしましょう。",
      responseLengthMediumDescription: "キャラクターと自然に会話を楽しみましょう。",
      responseLengthLongDescription: "返信がより豊かになります。",
      responseLengthNotice: "選択したモデルの基本料金の{factor}倍のクレジットを消費します。返信が長いほど多くのクレジットを消費します。",
      responseLengthCustom: "以前に設定したx{multiplier}の倍率を使用中です。下から選ぶとその長さに変わります。",
      restartChat: "会話を新しく始める",
      leaveChat: "チャットルームを退出",
    },
  },
};

export default ja;
