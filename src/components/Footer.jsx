function Footer({ cursor }) {
  return (
    <div className="footer">
      <span className="footer__info">
        Line {cursor.line}, Column {cursor.col}&nbsp;&nbsp;|&nbsp;&nbsp;{cursor.chars} characters
      </span>
      <span className="footer__credit">MdReader by Tom&#224;s!</span>
    </div>
  )
}

export default Footer
