import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="font-sans antialiased text-gray-900">
          <Main />
          <div id="portal" className="z-50" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
