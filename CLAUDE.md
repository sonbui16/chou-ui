# Chou Dress — Frontend (chou-ui)

Giao diện **storefront khách hàng** cho trang cho thuê váy Chou Dress — **chỉ phần khách, KHÔNG gồm admin**.
Là một trong 3 phần của `chou-dress/`: **`chou-ui`** (storefront — đang làm), `chou-admin`
(dashboard quản trị — làm sau), `chou-api` (backend — làm sau). Toàn bộ chữ trên UI dùng **tiếng Việt**, tiền tệ **VND**.

## Stack & lệnh
- **Vite + React + JavaScript (KHÔNG dùng TypeScript)** — file dùng đuôi `.jsx`, không `.tsx`/`.ts`.
- **Tailwind CSS v4** (tokens trong `@theme` của `src/index.css`), **shadcn/ui** cho component
  (skill `shadcn` đã cài trong `.agents/skills/`).
- Routing: **`react-router` v7** (KHÔNG dùng `react-router-dom` — v7 đã hợp nhất, import mọi thứ
  `BrowserRouter`/`Routes`/`Link`/`useNavigate`… từ `'react-router'`). Form: `react-hook-form` + `zod`. Icon: `lucide-react`.
- State toàn cục: **Redux Toolkit + redux-persist** (xem mục Kiến trúc). Data fetching: **@tanstack/react-query**.
- Lệnh: `npm run dev` (http://localhost:5173), `npm run build` (vite build) phải chạy không lỗi;
  lint bằng ESLint nếu có cấu hình.

## Hướng thiết kế — Luxury Editorial
Tạp chí thời trang cao cấp nhưng **sáng & luminous**: tông trắng / kem / be, **ánh sáng vàng nhẹ**.
Tránh look mặc định kiểu AI (cream+serif+terracotta) và cả nền đen + 1 accent chói.
- Palette: trắng ấm `#FCFBF7`, kem `#F3ECDD`, be/cát `#E3D6C0`, champagne (nhấn) `#C2A878`,
  mực ấm cho chữ `#2E2A24`, taupe phụ `#9C8F7C`. Không dùng đen tuyền hay màu rực.
- **Ánh sáng vàng nhẹ**: quầng gradient champagne dịu phía sau hero/ảnh; đường kẻ **hairline champagne**.
- Type: dùng **font mặc định của hệ thống** (không tải web font) — token trong `src/index.css`:
  `--font-display` = system serif (`ui-serif, Georgia…`) cho tiêu đề, `--font-sans` = system-ui cho body,
  `--font-mono` = system mono cho mã đơn/giá. Giữ vai trò serif/sans/mono, nhiều khoảng trắng, tracking rộng, radius nhỏ.
- Signature: module đặt thuê dạng *"phiếu hẹn thử đồ"* (khung hairline champagne, mã mono) trên nền kem.
- Map palette vào biến theme của shadcn (`--background`, `--primary`, `--accent`, …) thay vì màu mặc định.
- Quality floor: responsive tới mobile, focus bàn phím rõ, tôn trọng `prefers-reduced-motion`.



## Quy ước code
- Đặt component tái dùng ở `src/components/ui/`; logic thuần ở `src/lib/`; mock seed ở `src/data/`.
- Ưu tiên thêm component shadcn qua skill `shadcn` (CLI/registry) rồi style theo tokens, thay vì tự chế lại.

## Kiến trúc gọi API & state (3 tầng + store)
Luồng gọi API: **page/component → `features/*` (hook) → `services/*` (hàm API thuần) → `lib/apiClient` → `utils/http` (axios)**.
- **`src/services/`** — hàm gọi API **thuần, không React** (`auth.js`, `catalog.js`, `account.js`, `presence.js`).
  Mỗi hàm bọc `apiFetch` của `@/lib/apiClient`, nhận/trả dữ liệu, ném `ApiError` khi lỗi. KHÔNG import React/React Query ở đây.
- **`src/features/`** — **hook React Query** gom theo domain (`catalog/`, `account/`), gọi qua `services`.
  Hook query/mutation + cache key + invalidate nằm ở đây; trang chỉ `import { useProducts } from '@/features/catalog'`.
  Mỗi feature có `index.js` re-export để import gọn.
- **`src/store/`** — **state toàn cục dùng Redux Toolkit + redux-persist**:
  - `authSlice.js` (user/loading — KHÔNG persist), `cartSlice.js` (giỏ hàng — **được persist**, key `chou:cart`).
  - `index.js` — `configureStore` + `persistStore`; chỉ bọc `persistReducer` quanh cart. `main.jsx` bọc `<Provider>` + `<PersistGate>`.
  - `hooks.js` — `useAuth()` / `useCart()` giữ **nguyên API cũ** (`{ user, loading, login, register, logout }`, `{ items, count, add, remove, clear }`)
    nên các trang không phải đổi. `login/register` gọi `services/auth` rồi `dispatch(setUser)` — ném thẳng `ApiError`, không qua serialize của thunk.
  - `AuthBootstrap.jsx` — component null mount dưới `<Provider>`: gọi `getMe` khôi phục phiên + lắng nghe `chou:unauthorized` → đăng xuất.
  - Token vẫn ở localStorage qua `lib/apiClient` (không nằm trong Redux); chỉ giỏ hàng được redux-persist lưu.
- **`src/lib/apiClient.js`** — hạ tầng chung (token, Bearer, xử lý 401 → sự kiện `chou:unauthorized`); `utils/http.js` là axios base (baseURL từ `VITE_API_URL`).
- Thêm endpoint mới: viết hàm ở `services/<domain>.js` → tạo hook ở `features/<domain>/` → dùng trong page.

## Tổ chức `src/pages/`
Trang gom nhóm theo luồng: `pages/auth/` (Login, Register), `pages/catalog/` (Catalog, ProductDetail),
`pages/checkout/` (Cart, Checkout, OrderConfirmation), `pages/account/` (Account, RentalDetail);
Home/About/NotFound ở gốc `pages/`. Trang dùng import tuyệt đối `@/...` nên khai báo route trong `App.jsx` phải khớp đường dẫn nhóm.

## Dark mode
- Bật bằng class `.dark` trên `<html>`. Toàn bộ màu là CSS variable nên dark mode = override biến trong
  block `.dark { … }` ở `src/index.css` (không dùng tiện ích `dark:` rải rác).
- `src/components/ThemeToggle.jsx` (nút Moon/Sun ở header) toggle class + lưu localStorage key `chou:theme`;
  `index.html` có script nhỏ áp theme **trước khi render** để tránh nháng (FOUC); mặc định theo `prefers-color-scheme`.
- **Quy ước token nền tối**: chỗ cố tình nền tối + chữ sáng (footer, thanh thông báo, CTA, chip "đang chọn", badge)
  dùng cặp **`bg-ink` + `text-ink-foreground`** — `--ink` tối và `--ink-foreground` sáng ở **cả hai** theme.
  KHÔNG dùng `text-background` cho chữ-sáng-trên-nền-tối (nó đảo màu theo theme → mất chữ ở dark).
- Nhấn "đang chọn"/emphasis dùng `border-foreground`/`text-foreground`/`ring-foreground` (KHÔNG `*-ink`), vì ở light mode
  `--foreground` == `--ink` nên nhìn y hệt, còn dark mode tự sáng lên cho dễ thấy.

## Routing & xác thực (auth)
- `App.jsx` chia rõ bằng comment `{/* Public routes */}` và `{/* Private routes */}`. Route private bọc trong
  `<ProtectedRoute>` (`src/routes/ProtectedRoute.jsx`): đang `loading` → spinner; chưa đăng nhập → `Navigate` về `/dang-nhap`
  kèm `state.from` để quay lại sau khi login. Private: `/thanh-toan`, `/dat-hang/:rentalNo`, `/tai-khoan`, `/tai-khoan/don/:rentalNo`.
- **Chỉ có 1 access token, CHƯA có refresh token.** Token lưu localStorage key `chou:token` (qua `lib/apiClient`),
  mỗi request gắn `Authorization: Bearer`. Token hết hạn / gặp **401** → `clearToken()` + phát sự kiện `chou:unauthorized`
  → `AuthBootstrap` đăng xuất (đẩy về đăng nhập). Khôi phục phiên khi tải trang bằng `GET /auth/me`, KHÔNG phải bằng refresh.
  → Khi nào thêm refresh token cần phối hợp `chou-api` (endpoint `/auth/refresh` + lưu refresh token, nên dùng httpOnly cookie).

## Validate form
- Dùng **`zod` + `react-hook-form` + `@hookform/resolvers`** (`zodResolver`): khai báo `schema = z.object({...})` rồi
  `useForm({ resolver: zodResolver(schema) })`. Hiện áp dụng ở `pages/auth/Login.jsx` và `Register.jsx`;
  form khác (vd Checkout) chưa validate — khi thêm hãy theo đúng pattern này.

## Error boundary
- `src/components/ErrorBoundary.jsx` — **class component** (error boundary bắt buộc là class: `getDerivedStateFromError`
  + `componentDidCatch`), bọc quanh `<App />` trong `main.jsx`. Lỗi **render** runtime → màn fallback tiếng Việt
  (nút "Thử lại" reset state, "Về trang chủ"); dev hiện `error.message`. `AuthBootstrap`/`PresenceTracker`/`Toaster`
  đặt NGOÀI boundary để vẫn chạy nếu App crash.
- Boundary KHÔNG bắt: lỗi trong event handler, code bất đồng bộ (fetch/setTimeout), hay lỗi từ chính nó.
  Lỗi API vẫn do React Query + `ApiError` xử lý riêng.

## Cạm bẫy đã gặp
- Redux-persist: chỉ persist `cart` (key `chou:cart`), KHÔNG persist `auth`; nhớ bỏ qua các action persist
  (`FLUSH/REHYDRATE/…`) khỏi `serializableCheck` ở `configureStore` để tránh cảnh báo.
- Đổi cơ chế lưu giỏ hàng (localStorage thủ công → redux-persist) làm format khác nhau, nên giỏ hàng cũ của
  người dùng sẽ trống lần đầu sau khi cập nhật — bình thường.
- Ảnh sản phẩm cần **fallback** khi URL ngoài lỗi để không vỡ layout.
