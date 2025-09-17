# ThanksDeck

## 目次
1. [サービスの概要](#サービスの概要)
2. [主な機能](#主な機能)
3. [使用技術](#使用技術)
4. [インフラ構成図](#インフラ構成図)
5. [本アプリの開発背景について](#本アプリの開発背景について)
6. [アプリ開発の振り返り](#アプリ開発の振り返り)
7. [今後の展望](#今後の展望)
8. [まとめ](#まとめ)

<br>

## サービスの概要
「ThanksDeck（サンクスデック）」は、日々の感謝を記録するための個人向けアプリです。  
**"日々の感謝を忘れない"** をコンセプトに、習慣的なふりかえりをサポートします。

URL：https://thanksdeck.com

![Image](https://github.com/user-attachments/assets/d7b5c062-d1b6-4fdb-9883-cf584786f460)

<br>

## 主な機能

### ・認証・アカウント関連
メールアドレス認証、パスワードリセット、ゲストログイン

### ・カード作成
手軽に続けられるように、1枚あたり最大140文字、1日3枚まで作成できる仕様にしています。 
  
  <img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4113131/cdd39c21-0cfa-4b4e-95f5-948a97abc679.png" width="250"> 　　<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4113131/52ce8d01-d759-411d-a857-687e82ab2855.png" width="250">

### ・カード一覧表示
月ごと・日ごとに表示可能。ページネーション対応。
  
<img width="300" alt="スクリーンショット 2025-09-17 20 51 29" src="https://github.com/user-attachments/assets/4bd2d64f-54de-42bc-a8b2-35aa5c081e54" />
<img width="300" alt="スクリーンショット 2025-09-17 20 52 17" src="https://github.com/user-attachments/assets/0d2e7bf3-0c9b-474a-8380-989593420d2b" />

### ・カード詳細表示／編集／削除

<img width="400" alt="スクリーンショット 2025-09-17 20 50 33" src="https://github.com/user-attachments/assets/b92071f5-542e-4798-b433-52f3a65f6bbd" />

### ・カレンダー表示
記録した日はカレンダー上で色付けされ、習慣の継続状況を視覚的に確認できます。これにより、モチベーション維持につながります。  
  
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4113131/355f5b7e-bbf9-4d45-8283-db45bbcb0cdd.png" width="300">


### ・AI返信機能
  投稿したカード1枚ごとにAIからポジティブな返信が届きます。心理学的にも「行動に対する即時のポジティブフィードバック」は習慣化を促進するとされているため実装しました。  

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4113131/22cbdfe7-97d4-46f7-baf2-c35d5d5ff268.png" width="300">

<br>

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

<br>

## インフラ構成図

**◯ 全体**
- フロントエンドとバックエンドをAWSに統合
- Route53によるDNS管理
- ACMによるSSL/TLS証明書付与

**◯ フロントエンド（S3/CloudFront）**
- S3に静的ファイルを配置し、CloudFront（CDN）経由で高速配信
- GitHub Actions連携による自動デプロイ（S3アップロード・CloudFrontキャッシュ無効化）
- HTTPからHTTPSへの自動リダイレクト

**◯ バックエンド（ECS/Fargate）**
- RDSのプライベートサブネットへの配置
- GitHub ActionsとECRを連携した自動デプロイパイプライン（GitHub Actions → ECR → ECS(Fargate)）
  
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/df519c12-03ef-4a43-87fb-c30794f0cb29" />

<br>

## 画面

### ホーム

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/655c4c87-21be-4a0e-be46-fdb449357f82" />

---

### ログイン

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
|<img src="https://github.com/user-attachments/assets/acc0a46d-02ca-43a3-8ae5-faf69d2894d2" width="300"> | <img src="https://github.com/user-attachments/assets/aa95c80c-86ec-4233-8712-53500cef8fb8" width="300"> |

---

### 新規登録

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| <img src="https://github.com/user-attachments/assets/1cb9c947-e076-49a9-ab42-27df87610e90" width="300">| <img src="https://github.com/user-attachments/assets/d67545c7-c244-4f13-bf0b-f302c0cd6106" width="300">

---

### メールアドレス認証

#### 認証確認通知

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/fe4a511f-0602-48b0-b88c-b2e25a3d709b" />

#### 認証用メール

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/ad62c177-93ca-474f-92f0-a0a69fd333e4" />

---

### パスワードリセット

#### 再設定リクエスト

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| <img src="https://github.com/user-attachments/assets/30ce2432-15af-4b5f-a9b2-dd8ace9b4507" alt="Image" width="300"> | <img src="https://github.com/user-attachments/assets/c3be4d2c-78b8-456c-8731-ac5f4aadf7fc" alt="Image" width="300"> 
#### 再設定用メール

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/e077aef2-1d53-4ff4-b155-7ae1879edbb5" />

---
