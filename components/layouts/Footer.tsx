function Footer() {
    const authors = ['Vianney', 'Franck'];
  return (
    <div className=" flex flex-col bg-gray-100 items-center justify-center p-5">
        <p>All rights reserved, {new Date().getFullYear()}</p>
        <p>© {authors.join(' & ')}</p>
    </div>
  )
}

export default Footer