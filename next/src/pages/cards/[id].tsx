// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import XIcon from "@mui/icons-material/X";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import dayjs from "dayjs";
// import { useRouter } from "next/router";
// import React, { useState } from "react";
// import useSWR from "swr";

// import { api, fetcher } from "@/utils/api";
// import Layout from "../components/Layout";
// import CardFormModal from "../components/CardFormModal";

// export default function CardDetailPage() {
//   const router = useRouter();
//   const { id } = router.query;

//   // SWRでカードを取得
//   const {
//     data: card,
//     error,
//     mutate,
//   } = useSWR(id ? `/cards/${id}` : null, fetcher);

//   // インライン編集用ステート
//   const [isInlineEdit, setIsInlineEdit] = useState(false);
//   const [editContent, setEditContent] = useState("");
//   const [inlineError, setInlineError] = useState<string | null>(null);
//   const [isSavingInline, setIsSavingInline] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

//   // モーダル編集用ステート
//   const [isEditOpen, setIsEditOpen] = useState(false);

//   // 前画面へ戻る
//   const pageBack = () => router.back();

//   // ローディング／エラー時表示
//   if (!card && !error) {
//     return (
//       <Layout>
//         <CircularProgress />
//       </Layout>
//     );
//   }
//   if (error) {
//     return (
//       <Layout>
//         <Typography color="error" align="center" sx={{ mt: 4 }}>
//           カードの取得に失敗しました
//         </Typography>
//       </Layout>
//     );
//   }

//   // X（旧Twitter）シェア用URL
//   const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//     card.content
//   )}`;

//   // インライン編集：保存
//   const handleInlineSave = async () => {
//     setIsSavingInline(true);
//     setInlineError(null);
//     try {
//       await api.patch(`/cards/${card.id}`, {
//         card: { content: editContent, logged_date: card.logged_date },
//       });
//       await mutate();
//       setIsInlineEdit(false);
//     } catch (e: any) {
//       setInlineError(e.response?.data?.errors?.[0] ?? "更新に失敗しました");
//     } finally {
//       setIsSavingInline(false);
//     }
//   };

//   // インライン編集：キャンセル
//   const handleInlineCancel = () => {
//     if (editContent === card.content) {
//       setIsInlineEdit(false);
//     } else if (window.confirm("編集を破棄しますか？")) {
//       setEditContent(card.content);
//       setInlineError(null);
//       setIsInlineEdit(false);
//     }
//   };

//   return (
//     <Layout>
//       {/* 戻るボタン */}
//       <Box sx={{ mb: 2 }}>
//         <Button startIcon={<ArrowBackIosIcon />} onClick={pageBack}>
//           戻る
//         </Button>
//       </Box>

//       <Box sx={{ p: 2 }}>
//         {/* 本文 or 編集フォーム */}
//         {!isInlineEdit ? (
//           <Typography
//             variant="body1"
//             sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mb: 1 }}
//           >
//             {card.content}
//           </Typography>
//         ) : (
//           <>
//             {inlineError && (
//               <Typography color="error" sx={{ mb: 1 }}>
//                 {inlineError}
//               </Typography>
//             )}
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               helperText={
//                 <span
//                   style={{
//                     color: editContent.length > 140 ? "red" : undefined,
//                   }}
//                 >
//                   {editContent.length}/140
//                 </span>
//               }
//               error={Boolean(inlineError)}
//               FormHelperTextProps={{ sx: { mt: 0 } }}
//             />
//             <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
//               <Button onClick={handleInlineCancel} disabled={isSavingInline}>
//                 キャンセル
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleInlineSave}
//                 disabled={
//                   isSavingInline ||
//                   editContent.length === 0 ||
//                   editContent.length > 140
//                 }
//               >
//                 {isSavingInline ? <CircularProgress size={20} /> : "保存"}
//               </Button>
//             </Box>
//           </>
//         )}

//         {/* 編集モード切替ボタン */}
//         <Button
//           variant="text"
//           onClick={() => setIsInlineEdit((prev) => !prev)}
//           aria-label="編集モードに切替"
//           sx={{ mt: 1 }}
//         >
//           {isInlineEdit ? "一覧表示に戻す" : "編集モードに切替"}
//         </Button>

//         {/* 記録日 */}
//         <Typography
//           variant="caption"
//           color="text.secondary"
//           gutterBottom
//           sx={{ display: "block", mt: 2 }}
//         >
//           {dayjs(card.logged_date).format("YYYY年M月D日（ddd）")}
//         </Typography>

//         {/* 操作ボタン群 */}
//         <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
//           {/* モーダル編集 */}
//           <Button
//             variant="contained"
//             size="small"
//             onClick={() => setIsEditOpen(true)}
//           >
//             編集
//           </Button>
//           {/* 削除 */}
//           <Button
//             sx={{
//               "&:focus": {
//                 outline: "2px solid #ff9800",
//               },
//             }}
//             variant="outlined"
//             size="small"
//             color="error"
//             onClick={() => setIsDeleteDialogOpen(true)}
//           >
//             削除
//           </Button>

//           {/* Xシェア */}
//           <Tooltip title="カードをXでシェア">
//             <IconButton
//               component="a"
//               href={shareUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="カードをXでシェア"
//             >
//               <XIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>

//         {/* モーダル編集フォーム */}
//         {isEditOpen && (
//           <CardFormModal
//             open={isEditOpen}
//             onClose={() => setIsEditOpen(false)}
//             initialData={{
//               id: card.id,
//               content: card.content,
//               logged_date: card.logged_date,
//             }}
//             onCreate={async (updated) => {
//               await api.patch(`/cards/${card.id}`, { card: updated });
//               await mutate();
//               setIsEditOpen(false);
//             }}
//           />
//         )}
//       </Box>

//       <Dialog
//         open={isDeleteDialogOpen}
//         onClose={() => setIsDeleteDialogOpen(false)}
//       >
//         <DialogTitle>カードを削除しますか？</DialogTitle>
//         <DialogContent>
//           一度削除すると元に戻せません。本当に削除しますか？
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => setIsDeleteDialogOpen(false)}
//             disabled={isSavingInline}
//           >
//             キャンセル
//           </Button>
//           <Button
//             color="error"
//             onClick={async () => {
//               await api.delete(`/cards/${card.id}`);
//               router.push("/");
//             }}
//           >
//             削除する
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Layout>
//   );
// }

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import XIcon from '@mui/icons-material/X'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import useSWR from 'swr'

import CardFormModal from '../components/CardFormModal'
import Layout from '../components/Layout'
import { api, fetcher } from '@/utils/api'

export default function CardDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // 前の画面に戻る
  const pageBack = () => {
    router.back()
  }

  // カードデータ取得
  const {
    data: card,
    error,
    mutate,
  } = useSWR(id ? `/cards/${id}` : null, fetcher)

  // ローディング & エラー
  if (!card && !error) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    )
  }
  if (error) {
    return (
      <Layout>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          カードの取得に失敗しました
        </Typography>
      </Layout>
    )
  }

  //削除処理
  const handleDelete = async () => {
    await api.delete(`/cards/${card.id}`)
    router.back()
  }

  //Xシェア
  const XText = encodeURIComponent(card.content)
  const shareUrl = `https://twitter.com/intent/tweet?text=${XText}`

  return (
    <Layout>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIosIcon />} onClick={pageBack}>
          戻る
        </Button>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* カード内容 */}
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
          {card.content}
        </Typography>

        {/* 記録日 */}
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {dayjs(card.logged_date).format('YYYY年M月D日')}
        </Typography>

        {/* 編集・削除ボタン */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsEditOpen(true)}
          >
            編集
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            削除
          </Button>
        </Box>

        {/* X シェア */}
        <Tooltip title="Xに投稿する">
          <IconButton
            component="a"
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="カードをXでシェア"
          >
            <XIcon />
          </IconButton>
        </Tooltip>

        {/* 編集モーダル */}
        {isEditOpen && (
          <CardFormModal
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialData={{
              id: card.id,
              content: card.content,
              logged_date: card.logged_date,
            }}
            onCreate={async (updated) => {
              await api.patch(`/cards/${card.id}`, { card: updated })
              await mutate()
              setIsEditOpen(false)
            }}
          />
        )}
      </Box>

      {/* 削除確認ダイヤログ */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>ThanksCardが破棄されます</DialogTitle>
        <DialogContent>本当に削除しますか？</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>いいえ</Button>
          <Button color="error" onClick={handleDelete}>
            はい、削除します
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
