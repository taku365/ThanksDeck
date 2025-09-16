# ThanksDeck

## 目次
1. サービス概要
1. 主な機能
1. 画面操作
1. 使用技術
1. 本アプリの開発背景について
1. アプリ開発の振り返り
1. 今後の展望
1. まとめ

## サービスの概要
「ThanksDeck（サンクスデック）」は、日々の感謝を記録するための個人向けアプリです。
**"日々の感謝を忘れない"** をコンセプトに、習慣的なふりかえりをサポートします。

URL：https://thanksdeck.com


## 主な機能
**認証・アカウント関連**
メールアドレス認証、パスワードリセット、ゲストログイン

**ThanksCard**
・カード作成（1日最大3枚まで作成可能）
・カード一覧表示（月ごと・日ごとにフィルタリング）
・カード詳細表示／編集／削除
・ページネーション

**AIリプライ**
・作成したカードに対してChatGPTが自動返信



## 使用技術

本サービスの開発に使用した技術は、以下の2点を軸に選定しています。
- アプリ開発の基礎を効率的に学べるように、学習リソースが豊富な技術であること
- 実務環境ですぐに活用できるように、業界で広く採用されている技術であること

| カテゴリ | 使用技術 |
| --- | --- |
| フロントエンド | Next.js (14.2.30), React(18.2.0), TypeScript (5.3.3) |
| バックエンド | Ruby (3.1.2), Rails (7.1.5) |
| データベース | MySQL(8.0.32) |
| インフラ | Amazon Web Services|
| 実行環境 / プラットフォーム | Docker(28.0.4） / Node.js 20 |
| CI/CD | GitHub Actions |
| テスト / 静的解析 | ESLint, Prettier, RuboCop, RSpec |

<details>
<summary>詳細（ライブラリ / Gem / 開発補助ツール）</summary>

- **フロントエンドライブラリ**: MUI (Material UI), Emotion, SWR, Axios, react-hook-form, dayjs, @mui/x-date-pickers
- **認証 (Rails)**: devise, devise-i18n, devise_token_auth
- **API / シリアライザ**: active_model_serializers
- **ページネーション**: kaminari
- **CORS対応**: rack-cors
- **i18n / 設定管理**: rails-i18n, config
- **AI連携**: ruby-openai
- **Webサーバー**: Puma, Nginx
- **開発補助**: FactoryBot, Faker, letter_opener_web, pry-rails, pry-byebug

</details>



## インフラ構成図

<img width="959" height="1090" alt="Image" src="https://github.com/user-attachments/assets/df519c12-03ef-4a43-87fb-c30794f0cb29" />

## 画面

<img width="1249" height="879" alt="Image" src="https://github.com/user-attachments/assets/655c4c87-21be-4a0e-be46-fdb449357f82" />

### ホーム

---

### ログイン

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
|![Image](https://github.com/user-attachments/assets/acc0a46d-02ca-43a3-8ae5-faf69d2894d2) | ![Image](https://github.com/user-attachments/assets/aa95c80c-86ec-4233-8712-53500cef8fb8) |

---

### 新規登録

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| ![Image](https://github.com/user-attachments/assets/1cb9c947-e076-49a9-ab42-27df87610e90) | ![Image](https://github.com/user-attachments/assets/d67545c7-c244-4f13-bf0b-f302c0cd6106) |

---

### メールアドレス認証

#### 認証確認通知

<img width="1274" height="875" alt="Image" src="https://github.com/user-attachments/assets/3daa023e-4d36-4fef-86a4-d2ee02f51456" />

---

#### 認証用メール

<img width="671" height="339" alt="Image" src="https://github.com/user-attachments/assets/ad62c177-93ca-474f-92f0-a0a69fd333e4" />

---

### パスワードリセット

#### 再設定リクエスト

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| ![Image](https://github.com/user-attachments/assets/30ce2432-15af-4b5f-a9b2-dd8ace9b4507) | ![Image](https://github.com/user-attachments/assets/c3be4d2c-78b8-456c-8731-ac5f4aadf7fc) |

---

#### 再設定用メール

<img width="668" height="300" alt="Image" src="https://github.com/user-attachments/assets/e077aef2-1d53-4ff4-b155-7ae1879edbb5" />

---
