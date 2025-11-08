import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Todo from './component/Todo'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Todo />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
