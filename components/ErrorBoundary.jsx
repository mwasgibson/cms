import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 p-8 text-center">
          <p className="font-display text-lg font-semibold text-red-700">
            Something went wrong
          </p>
          <p className="mt-1 text-sm text-red-600">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
