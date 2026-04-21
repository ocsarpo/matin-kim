// helloMatin — full catalog (hierarchical: collection → product → colors → sizes)
// Prices: discountPrice = 30% off originalPrice

const IMG = (p) => './images/' + p;

const COLLECTIONS = [
  { id: 'outer', name: 'OUTER', ko: '아우터',       swatch: IMG('MK2400JP002MIV.jpg') },
  { id: 'top',   name: 'TOP',   ko: '탑 · 니트',    swatch: IMG('MK2400TS041MBB.jpeg') },
  { id: 'denim', name: 'DENIM', ko: '팬츠 · 데님',  swatch: IMG('MK2477DN028MGY.jpg') },
  { id: 'bag',   name: 'BAG',   ko: '백 · 월렛',    swatch: IMG('MK2400BG057M.jpg') },
];

const PRODUCTS = [
  // ============ OUTER ============
  {
    id: 'logo-coating-jumper',
    collection: 'outer',
    name: 'LOGO COATING JUMPER',
    originalPrice: 162000,
    discountPrice: 113400,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=3339&cate_no=26&display_group=1',
    colors: [
      { id: 'iv', name: 'IVORY', hex: '#f0e9d8', image: IMG('MK2400JP002MIV.jpg'), sizes: [{ label: 'FREE', stock: 3 }] },
      { id: 'gy', name: 'GREY',  hex: '#9a9a96', image: IMG('MK2400JP002MGY.jpg'), sizes: [{ label: 'FREE', stock: 2 }] },
      { id: 'na', name: 'NAVY',  hex: '#1f2a40', image: IMG('MK2400JP002MNA.jpg'), sizes: [{ label: 'FREE', stock: 1 }] },
      { id: 'pk', name: 'PINK',  hex: '#f5c8cc', image: IMG('MK2400JP002M.jpg'),   sizes: [{ label: 'FREE', stock: 5 }] },
    ],
  },
  {
    id: 'volume-pocket-knit-zip-up',
    collection: 'outer',
    name: 'VOLUME POCKET KNIT ZIP UP',
    originalPrice: 198000,
    discountPrice: 138600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6443&cate_no=26&display_group=1',
    colors: [
      { id: 'na', name: 'NAVY', hex: '#1f2a40', image: IMG('MK249OCD039M_NA_S.jpg'),
        sizes: [{ label: 'S', stock: 2 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }] },
    ],
  },
  {
    id: 'hairy-crochet-cardigan',
    collection: 'outer',
    name: 'HAIRY CROCHET CARDIGAN FOR MEN',
    originalPrice: 168000,
    discountPrice: 117600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6163&cate_no=26&display_group=1',
    colors: [
      { id: 'br', name: 'BROWN', hex: '#6b4a2a', image: IMG('MK2477CD536H_BR_L.jpg'),
        sizes: [{ label: 'S', stock: 0 }, { label: 'M', stock: 0 }, { label: 'L', stock: 1 }] },
    ],
  },
  {
    id: 'lightweight-padded-vest',
    collection: 'outer',
    name: 'LIGHTWEIGHT PADDED VEST',
    originalPrice: 188000,
    discountPrice: 131600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6181&cate_no=26&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2477VT005M.jpg'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'oversize-belted-long-coat',
    collection: 'outer',
    name: 'OVERSIZE BELTED LONG COAT',
    originalPrice: 458000,
    discountPrice: 320600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6578&cate_no=26&display_group=1',
    colors: [
      { id: 'ch', name: 'CHARCOAL', hex: '#3a3a3a', image: IMG('MK249OCT005M_CH_M.jpg'),
        sizes: [{ label: 'S', stock: 0 }, { label: 'M', stock: 1 }, { label: 'L', stock: 0 }] },
    ],
  },

  // ============ TOP ============
  {
    id: 'matin-heritage-top',
    collection: 'top',
    name: 'MATIN HERITAGE TOP',
    originalPrice: 68000,
    discountPrice: 47600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=5088&cate_no=27&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2400TS005MBB.jpg'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'logo-cutted-crop-top',
    collection: 'top',
    name: 'LOGO CUTTED CROP TOP',
    originalPrice: 58000,
    discountPrice: 40600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=4964&cate_no=27&display_group=1',
    colors: [
      { id: 'wh', name: 'WHITE', hex: '#f6f6f2', image: IMG('MK2400TS002MWH.jpg'),
        sizes: [{ label: 'S', stock: 2 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }] },
    ],
  },
  {
    id: 'logo-cutted-layered-top',
    collection: 'top',
    name: 'LOGO CUTTED LAYERED TOP',
    originalPrice: 88000,
    discountPrice: 61600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=4962&cate_no=27&display_group=1',
    colors: [
      { id: 'wh', name: 'WHITE', hex: '#f6f6f2', image: IMG('MK2400TS003MWH.jpg'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'logo-crop-top',
    collection: 'top',
    name: 'LOGO CROP TOP',
    originalPrice: 39000,
    discountPrice: 27300,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=4132&cate_no=27&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2400TS041MBB.jpeg'),
        sizes: [{ label: 'S', stock: 2 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }] },
      { id: 'wh', name: 'WHITE', hex: '#f6f6f2', image: IMG('MK2400TS041MWH.jpg'),
        sizes: [{ label: 'S', stock: 4 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }] },
    ],
  },
  {
    id: 'logo-top',
    collection: 'top',
    name: 'LOGO TOP',
    originalPrice: 41000,
    discountPrice: 28700,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=5319&cate_no=27&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2400TS042MBB.jpg'),
        sizes: [{ label: 'FREE', stock: 2 }] },
    ],
  },
  {
    id: 'color-line-point-knit-pullover',
    collection: 'top',
    name: 'COLOR LINE POINT LOGO KNIT PULLOVER',
    originalPrice: 148000,
    discountPrice: 103600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6158&cate_no=27&display_group=1',
    colors: [
      { id: 'gy', name: 'GREY', hex: '#8a8a86', image: IMG('MK2477PO020M_GY_S.jpg'),
        sizes: [{ label: 'S', stock: 1 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }] },
    ],
  },
  {
    id: 'spell-point-stripe-knit-vest',
    collection: 'top',
    name: 'SPELL POINT STRIPE KNIT VEST',
    originalPrice: 148000,
    discountPrice: 103600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=3682&cate_no=27&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2400KV002M.jpg'),
        sizes: [{ label: 'M', stock: 0 }, { label: 'L', stock: 2 }] },
      { id: 'iv', name: 'IVORY', hex: '#eee7d6', image: IMG('MK2400KV002M_IV.jpg'),
        sizes: [{ label: 'M', stock: 1 }, { label: 'L', stock: 3 }] },
    ],
  },

  // ============ DENIM ============
  {
    id: 'knee-point-stripe-denim',
    collection: 'denim',
    name: 'KNEE POINT STRIPE DENIM',
    originalPrice: 168000,
    discountPrice: 117600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6094&cate_no=28&display_group=1',
    colors: [
      { id: 'gy', name: 'GREY', hex: '#8a8a86', image: IMG('MK2477DN028MGY.jpg'),
        sizes: [{ label: 'S', stock: 0 }, { label: 'M', stock: 1 }, { label: 'L', stock: 0 }] },
    ],
  },
  {
    id: 'side-washed-denim',
    collection: 'denim',
    name: 'SIDE WASHED DENIM',
    originalPrice: 168000,
    discountPrice: 117600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6151&cate_no=28&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2477DN034MBB.jpg'),
        sizes: [{ label: 'S', stock: 1 }, { label: 'M', stock: 0 }, { label: 'L', stock: 0 }] },
    ],
  },

  // ============ BAG ============
  {
    id: 'madeleine-round-bag',
    collection: 'bag',
    name: 'MADELEINE ROUND BAG',
    originalPrice: 158000,
    discountPrice: 110600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=4629&cate_no=70&display_group=1',
    colors: [
      { id: 'pk', name: 'PINK',        hex: '#f0c9c4', image: IMG('MK2400BG057M.jpg'),   sizes: [{ label: 'FREE', stock: 2 }] },
      { id: 'le', name: 'LIGHT BEIGE', hex: '#e4d7c3', image: IMG('MK2400BG057MLE.jpg'), sizes: [{ label: 'FREE', stock: 2 }] },
      { id: 'lk', name: 'LIGHT KHAKI', hex: '#b6b097', image: IMG('MK2400BG057MLK.jpg'), sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'half-shirring-ribbon-round-bag',
    collection: 'bag',
    name: 'HALF SHIRRING RIBBON ROUND BAG',
    originalPrice: 157000,
    discountPrice: 109900,
    detailUrl: 'https://kream.co.kr/products/430573?base_product_id=430573',
    colors: [
      { id: 'ch', name: 'CHARCOAL', hex: '#3a3a3a', image: IMG('MK2500BG002VCH.jpg'), sizes: [{ label: 'FREE', stock: 1 }] },
      { id: 'pk', name: 'PINK',     hex: '#f0c9c4', image: IMG('MK2411BG002MPK.jpg'), sizes: [{ label: 'FREE', stock: 2 }] },
    ],
  },
  {
    id: 'baby-sporty-tote-bag',
    collection: 'bag',
    name: 'BABY SPORTY TOTE BAG',
    originalPrice: 138000,
    discountPrice: 96600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=4060&cate_no=70&display_group=1',
    colors: [
      { id: 'lg', name: 'LIGHT GREY', hex: '#cfcfcb', image: IMG('MK2400BG020MLG.jpg'),
        sizes: [{ label: 'FREE', stock: 2 }] },
    ],
  },
  {
    id: 'classic-chain-mini-bag',
    collection: 'bag',
    name: 'CLASSIC CHAIN QUILTING MINI BAG',
    originalPrice: 150000,
    discountPrice: 105000,
    detailUrl: 'https://kream.co.kr/products/281243?base_product_id=281242',
    colors: [
      { id: 'iv', name: 'IVORY', hex: '#eee7d6', image: IMG('Classic Chain Quilting Mini Bag.webp'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'faux-leather-seashell-bag',
    collection: 'bag',
    name: 'FAUX LEATHER SEASHELL BAG',
    originalPrice: 289000,
    discountPrice: 202300,
    detailUrl: 'https://kream.co.kr/products/249857?base_product_id=245550',
    colors: [
      { id: 'iv', name: 'IVORY', hex: '#efe7d3', image: IMG('Matin Kim Faux Leather Seashell Bag Ivory.webp'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'stud-leather-hobo-bag',
    collection: 'bag',
    name: 'STUD LEATHER HOBO BAG',
    originalPrice: 298000,
    discountPrice: 208600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=6004&cate_no=70&display_group=1',
    colors: [
      { id: 'bb', name: 'BLACK', hex: '#0a0a0a', image: IMG('MK2477BG027MBB.jpg'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
  {
    id: 'accordion-wallet',
    collection: 'bag',
    name: 'ACCORDION WALLET',
    originalPrice: 88000,
    discountPrice: 61600,
    detailUrl: 'https://matinkim.com/product/detail.html?product_no=3029&cate_no=167&display_group=1',
    colors: [
      { id: 'sv', name: 'SILVER', hex: '#c8c8c8', image: IMG('MK2400WL001MSV.jpg'),
        sizes: [{ label: 'FREE', stock: 1 }] },
    ],
  },
];
