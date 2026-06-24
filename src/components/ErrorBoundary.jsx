import { Component } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Error boundary toàn cục: bắt lỗi render runtime trong cây con và hiển thị
 * màn fallback (tiếng Việt, theo phong cách Chou) thay vì màn hình trắng.
 *
 * Lưu ý: error boundary BẮT BUỘC là class component — React chưa có bản hook
 * tương đương cho `getDerivedStateFromError` / `componentDidCatch`.
 * Boundary KHÔNG bắt lỗi trong: event handler, code bất đồng bộ (setTimeout, fetch),
 * SSR, và lỗi ném ra từ chính nó. Lỗi API đã được React Query xử lý riêng.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Lần render kế tiếp sẽ hiện fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Chỗ này để gửi log lên dịch vụ theo dõi lỗi (Sentry…) nếu có.
    console.error('ErrorBoundary đã bắt lỗi:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    // Cho phép truyền fallback tuỳ biến qua prop; mặc định dùng màn dưới đây.
    if (this.props.fallback) {
      return this.props.fallback({ error: this.state.error, reset: this.handleReset })
    }

    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <p className="eyebrow mb-2">Rất tiếc</p>
        <h1 className="font-[var(--font-display)] text-4xl">Đã có lỗi xảy ra</h1>
        <p className="mt-3 text-muted-foreground">
          Trang gặp sự cố ngoài dự kiến. Bạn vui lòng thử lại hoặc quay về trang chủ.
        </p>

        {import.meta.env.DEV && this.state.error && (
          <pre className="mt-6 max-w-full overflow-auto rounded-md border border-dashed hairline bg-muted/40 p-4 text-left font-mono text-xs text-muted-foreground">
            {this.state.error.message}
          </pre>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={this.handleReset}>Thử lại</Button>
          <Button variant="outline" onClick={() => window.location.assign('/')}>
            Về trang chủ
          </Button>
        </div>
      </div>
    )
  }
}
