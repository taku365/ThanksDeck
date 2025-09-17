# ThanksDeck

## 目次
1. [サービスの概要](#サービスの概要)
2. [開発背景](#開発背景)
3. [主な機能](#主な機能)
4. [使用技術](#使用技術)
5. [インフラ構成図](#インフラ構成図)
6. [開発の振り返りと今後の展望](#開発の振り返りと今後の展望)
7. [まとめ](#まとめ)

<br>

## サービスの概要
「ThanksDeck（サンクスデッキ）」は、日々の感謝を記録するための個人向けアプリです。  
**"日々の感謝を忘れない"** をコンセプトに、習慣的なふりかえりをサポートします。

URL：https://thanksdeck.com

![Image](https://github.com/user-attachments/assets/d7b5c062-d1b6-4fdb-9883-cf584786f460)

<br>

## 開発背景
「日常生活の中の課題を解決できるアプリは何だろうか」と考えたとき、私は「感謝する習慣」に注目しました。  

日常ではネガティブな出来事や感情はすぐ思い出せる一方で、ポジティブな感情や出来事は意識しないと振り返りにくいと感じていました。さらに、ニュースやSNSでもネガティブな情報が多く、前向きな気持ちを保つことが難しい場面も多くあります。  

そんなときに出会ったのが **『GRATITUDE 毎日を好転させる感謝の習慣』** という本です。

https://amzn.asia/d/gxyiRSj

この本には「感謝する習慣」が生む大きなメリット、また習慣が「逆境や困難に立ち向かうときのセーフティーネットになること」が書かれており、大きな気づきを得ました。  

しかし実際に感謝日記を続けようとすると、最初は気合で書けても習慣が途切れてしまうことが多いのが現実です。理由を考えると、  

- ノートを広げて書く手間  
- 時間がかかること  
- 書いても反応がないこと  

といった点が挫折につながっているのだと思いました。  

そこで私は、  
- **スマホで気づいたときに気軽に記録できること**  
- **書いた内容にAIから前向きな反応が返ってくること**  

によって、楽しみながら継続できる仕組みを作れると考えました。  
その発想を形にしたのが、今回開発した感謝カードアプリ **「ThanksDeck」** です。  
</details>

<br>

## 主な機能

### ・認証・アカウント関連
メールアドレス認証、パスワードリセット、ゲストログイン

#### ログイン

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
|<img src="https://github.com/user-attachments/assets/acc0a46d-02ca-43a3-8ae5-faf69d2894d2" width="300"> | <img src="https://github.com/user-attachments/assets/aa95c80c-86ec-4233-8712-53500cef8fb8" width="300"> |

#### 新規登録

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| <img src="https://github.com/user-attachments/assets/1cb9c947-e076-49a9-ab42-27df87610e90" width="300">| <img src="https://github.com/user-attachments/assets/d67545c7-c244-4f13-bf0b-f302c0cd6106" width="300">


#### メールアドレス認証

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/fe4a511f-0602-48b0-b88c-b2e25a3d709b" />
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/ad62c177-93ca-474f-92f0-a0a69fd333e4" />


#### パスワードリセット

| 入力時バリデーション | 送信時バリデーション |
| -- | -- |
| <img src="https://github.com/user-attachments/assets/30ce2432-15af-4b5f-a9b2-dd8ace9b4507" alt="Image" width="300"> | <img src="https://github.com/user-attachments/assets/c3be4d2c-78b8-456c-8731-ac5f4aadf7fc" alt="Image" width="300"> 

<img width="600" alt="Image" src="https://github.com/user-attachments/assets/e077aef2-1d53-4ff4-b155-7ae1879edbb5" />


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

**◯ フロントエンド（S3＋CloudFront）**
- S3に静的ファイルを配置し、CloudFront（CDN）経由で高速配信
- GitHub Actions連携による自動デプロイ（S3アップロード・CloudFrontキャッシュ無効化）
- HTTPからHTTPSへの自動リダイレクト

**◯ バックエンド（ECS/Fargate）**
- RDSのプライベートサブネットへの配置
- GitHub ActionsとECRを連携した自動デプロイパイプライン（GitHub Actions → ECR → ECS(Fargate)）
  
<img width="600" alt="Image" src="https://github.com/user-attachments/assets/df519c12-03ef-4a43-87fb-c30794f0cb29" />

<br>

## 開発の振り返りと今後の展望

<details>
<summary><b>良かった点</b></summary>
  
- **設計からデプロイまで一連の流れを経験できたこと**  
  フロントエンド（Next.js）、バックエンド（Rails API）、データベース（MySQL）、インフラ（Docker・AWS）、さらにCI/CDの構築まで一貫して取り組むことで、Webサービス開発の全体像を把握することができました。  

- **学習リソースの豊富な技術を選定した点**  
  Next.jsやRailsは情報が多く、検索すれば解決策が見つかりやすいため、完全に行き詰まることなく学習を進められました。

</details>

<br>

<details>
<summary><b>苦労した点</b></summary>

- **アイデアを形にする難しさ**  
  0から1を生み出すために、アプリのコンセプトや機能、デザインまで自分で考える必要があり、非常に苦労しました。  
  また、実際に運用するにはUI/UXだけでなくセキュリティや費用面にも配慮が必要だと知り、Webサービスを1つ作ることの難しさを実感しました。   

- **技術の組み合わせによる難易度の上昇**  
  個別に学習した技術は理解できても、実際にReactとRailsを連携させたり、AWSで本番環境を構築したりする段階になると一気に難易度が上がりました。特に認証処理やインフラ設定は、思った以上に調整が必要で大きな壁となりました。  

</details>

<br>

<details>
<summary><b>工夫した点</b></summary>

- **シンプルなUI設計**  
  MUIを活用し、説明がなくても直感的に操作できるデザインを意識しました。  

- **タスクを小さく分割**  
  「ページ作成 → API実装 → フロント接続」といった流れで小さなタスクに分割し、エラーが発生した際に原因を切り分けやすくしました。  

- **AIリプライ機能の導入**  
  ChatGPT APIを利用して、カードに対する自動返信機能を追加しました。これにより、単なる記録用アプリではなく、AIからのフィードバックが得られる独自性のあるサービスに仕上げることができました。  

</details>

<br>

<details>
<summary><b>反省点</b></summary>

- **仕様を詰めきれずに進めてしまった**  
  実装を優先するあまり、仕様を十分に固めないまま進めてしまい、後から手戻りが発生する場面がありました。今後は初期段階で画面遷移図やワイヤーフレームをしっかり作成し、設計を整理してから実装に入るようにしたいです。  

- **非機能要件を考慮しきれなかった**  
  サービスとして運用する場合に重要なパフォーマンス、セキュリティ、コスト最適化などは十分に検討できませんでした。次回はインフラ設計の段階でこれらを意識し、より現実的な構成を目指します。  

- **時間配分の難しさ**  
  学習と実装を同時並行で進めたため、調査に時間を取られて進捗が遅れることがありました。今後は学習フェーズと実装フェーズを区切り、タスクを明確に分けて取り組むことで効率を高めたいです。  

</details>

<br>

<details>
<summary><b>今後の展望</b></summary>

- **UI/UX の改善**  
  今回はMUIを使用しましたが、よりユーザーが利用しやすいUIを実現するためにデザインについて学び改善していきたいです。 

- **セキュリティ強化**  
  本格的な運用を想定すると、CSRF対策・レート制限・ログ監視など、現状不足しているセキュリティ対策を段階的に導入する必要があります。  

- **機能追加**  
  ソーシャル機能（他ユーザーの投稿閲覧やシェア）
  AI機能の拡張（カード内容に基づいた分析や感情傾向の可視化）  

</details>

<br>

## まとめ

今回、「ThanksDeck」というアプリをポートフォリオとして開発してきました。  
開発過程では、単に機能を実装するだけではなく、「どうすれば使いやすいか」「学習のモチベーションを維持するにはどうするべきか」というユーザー視点に立ち続けることを常に意識して取り組んできました。  
