# Chou Dress — Frontend (chou-ui)

Giao diện **storefront khách hàng** cho trang cho thuê váy Chou Dress — **chỉ phần khách, KHÔNG gồm admin**.
Là một trong 3 phần của `chou-dress/`: **`chou-ui`** (storefront — đang làm), `chou-admin`
(dashboard quản trị — làm sau), `chou-api` (backend — làm sau). Toàn bộ chữ trên UI dùng **tiếng Việt**, tiền tệ **VND**.

## Stack & lệnh
- **Vite + React + JavaScript (KHÔNG dùng TypeScript)** — file dùng đuôi `.jsx`, không `.tsx`/`.ts`.
- **Tailwind CSS v4** (tokens trong `@theme` của `src/index.css`), **shadcn/ui** cho component
  (skill `shadcn` đã cài trong `.agents/skills/`).
- Routing: `react-router-dom`. Form: `react-hook-form` + `zod`. Icon: `lucide-react`.
- Lệnh: `npm run dev` (http://localhost:5173), `npm run build` (vite build) phải chạy không lỗi;
  lint bằng ESLint nếu có cấu hình.

## Hướng thiết kế — Luxury Editorial
Tạp chí thời trang cao cấp nhưng **sáng & luminous**: tông trắng / kem / be, **ánh sáng vàng nhẹ**.
Tránh look mặc định kiểu AI (cream+serif+terracotta) và cả nền đen + 1 accent chói.
- Palette: trắng ấm `#FCFBF7`, kem `#F3ECDD`, be/cát `#E3D6C0`, champagne (nhấn) `#C2A878`,
  mực ấm cho chữ `#2E2A24`, taupe phụ `#9C8F7C`. Không dùng đen tuyền hay màu rực.
- **Ánh sáng vàng nhẹ**: quầng gradient champagne dịu phía sau hero/ảnh; đường kẻ **hairline champagne**.
- Type: serif tương phản cao, thanh mảnh (Playfair Display / Cormorant) cho tiêu đề + sans sạch
  (Inter / Hanken Grotesk) cho body + mono (IBM Plex Mono) cho mã đơn/giá. Nhiều khoảng trắng,
  tracking rộng, weight nhẹ; góc bo rất nhẹ (radius nhỏ).
- Signature: module đặt thuê dạng *"phiếu hẹn thử đồ"* (khung hairline champagne, mã mono) trên nền kem.
- Map palette vào biến theme của shadcn (`--background`, `--primary`, `--accent`, …) thay vì màu mặc định.
- Quality floor: responsive tới mobile, focus bàn phím rõ, tôn trọng `prefers-reduced-motion`.



## Quy ước code
- Đặt component tái dùng ở `src/components/ui/`; trang ở `src/pages/`;
  logic thuần ở `src/lib/`; mock seed ở `src/data/`.
- Ưu tiên thêm component shadcn qua skill `shadcn` (CLI/registry) rồi style theo tokens, thay vì tự chế lại.

## Cạm bẫy đã gặp
- Store dùng `useSyncExternalStore`: **`getSnapshot` phải trả tham chiếu ổn định** (cả state),
  selector áp dụng *sau* khi lấy snapshot — trả mảng mới trong `getSnapshot` gây render-loop vô hạn.
- Ảnh sản phẩm cần **fallback** khi URL ngoài lỗi để không vỡ layout.
