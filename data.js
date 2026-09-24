// シリーズと漫画のデータ。新しいスタンプ・漫画はここに足すだけでサイトに出る。
// シリーズ: img/<slug>/main.webp と 01〜40.webp を置き、下の配列に1件追加する。
// 漫画:     manga/<id>/01.webp〜 を置き、MANGA に1件追加する。

const SERIES = [
  {
    slug: "frebull",
    name: "フレブル【ハロウィン】",
    lineId: "36788039",
    color: "#E89A4B",
    catch: "仮装させられた本音",
    desc: "ハロウィン仮装をさせられたフレブルちゃんの本音です・・・",
    isNew: true,
  },
  {
    slug: "plants",
    name: "観葉植物",
    lineId: "36667368",
    color: "#7FA86B",
    catch: "水やりに思うところがある",
    desc: "水やりや日当たりに思うところがある観葉植物たち。真顔と静かな違和感がじわじわくる、挨拶や返事、日常会話に使える脱力系スタンプです。",
  },
  {
    slug: "futon",
    name: "人々【布団】",
    lineId: "36658166",
    color: "#8C9DB5",
    catch: "布団から出たくない人専用",
    desc: "布団から出たくない人たちを集めた、真顔で脱力感のあるLINEスタンプ。返事、了解、あと5分、起床保留など、朝の本音をじわっと使えます。",
  },
  {
    slug: "shiitake",
    name: "美容しいたけ",
    lineId: "36613938",
    color: "#B07A55",
    catch: "美意識だけは負けない",
    desc: "美容と自分磨きに余念がない、意識高い系しいたけ。パック、保湿、ヘアケアまで今日もぬかりなし。美意識だけは誰にも負けない、じわじわシュールなしいたけちゃんです。",
  },
  {
    slug: "sushi",
    name: "寿司病院",
    lineId: "36613931",
    color: "#D96C5F",
    catch: "寿司たちが静かに通う",
    desc: "寿司たちが静かに通う、ちょっと変な病院スタンプ。診察、待ち時間、薬局など病院あるあるを真顔と脱力感でじわじわ楽しめます。",
  },
  {
    slug: "yasai",
    name: "人面野菜",
    lineId: "36585466",
    color: "#E0833F",
    catch: "今日なに食べる？",
    desc: "人の顔がついた野菜たちが、真顔でゆるく日常会話。ちょっと哀愁、ちょっと違和感。毎日のやりとりや「今日なに食べる？」にも使える、じわじわ系LINEスタンプです。",
  },
];

// kind は "豆知識" か "あるある"
// 例: { id: "yasai-02", kind: "あるある", series: "yasai", title: "タイトル", pages: ["manga/yasai-02/01.webp"] }
const MANGA = [
  { id: "yasai-01", kind: "豆知識", series: "yasai", title: "鍋の白菜、いつ入れるのがええの？", pages: ["manga/yasai-01/01.webp"] },
  { id: "shiitake-01", kind: "豆知識", series: "shiitake", title: "しいたけ、洗ってる？", pages: ["manga/shiitake-01/01.webp"] },
  { id: "plants-01", kind: "豆知識", series: "plants", title: "お水って、毎日ほしいと思ってる？", pages: ["manga/plants-01/01.webp"] },
];

const STICKER_COUNT = 40;
const lineUrl = (id) => `https://store.line.me/stickershop/product/${id}/ja`;
