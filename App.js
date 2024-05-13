import './index.css'
import logo from './imagens/Logo.png'
import { CiCirclePlus } from "react-icons/ci";
import clipboard from './imagens/Clipboard.png'
import { FaRegCircle, FaCheckCircle, FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';
import { addDoc, collection, doc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from './firebaseconnection';
import { deleteDoc } from 'firebase/firestore';
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

function App() {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState([])
  const [select, setSelect] = useState([])
  const [underlined, setUnderlined] = useState(false)
  const [loadTasks, setLoadTasks] = useState(false)
  const [taskInputClicked, setTaskInputClicked] = useState(false)
  const inputRef = useRef(null);


  async function register(e) {
    e.preventDefault();

    if (taskInput === '') {
      alert('Dê um nome a sua tarefa!')
      return;
    }

    let docRef
    docRef = await addDoc(collection(db, "tarefas"), {
      tarefa: taskInput,
      created: new Date(),
      select: underlined,
    })
      .then(() => {
        console.log('tarefa criada com sucesso!')
        setTaskInput('');
        console.log(docRef.id)
      })

      .catch((err) => {
        console.log(err);
      })

  }

  useEffect(() => {

    async function loadTasks() {
      const tarefaRef = collection(db, "tarefas")

      const q = query(tarefaRef, orderBy('created', 'desc'))

      const unsub = onSnapshot(q, (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            tarefa: doc.data().tarefa,
            id: doc.id
          })
          console.log(doc.id)
        })
        setTasks(lista)
      })
    }
    loadTasks();
  }, [])

  function handleSelect(id) {


    setSelect(prevSelect => {
      const isSelected = select.includes(id);
      return isSelected ? prevSelect.filter(selectedId => selectedId !== id) : [...prevSelect, id];
    });

    setUnderlined(prevUnderline => !prevUnderline)
  }

  async function handleDelete(id) {
    const docRef = doc(db, 'tarefas', id)
    console.log(docRef)
    await deleteDoc(docRef);
    setSelect(prevSelect => prevSelect.filter(selectedId => selectedId !== id));
    // alert(item.id)
  }


  return (
    <div className='topo'>
      <img src={logo} alt='logo' className='logo' />
      <input type="text" className="inputTask" ref={inputRef} placeholder={taskInputClicked ? "Descrição da tarefa " : "Adicione uma nova tarefa"} value={taskInput} onClick={() => setTaskInputClicked(true)} onChange={(e) => setTaskInput(e.target.value)} />
      <button className="btnAdd" onClick={register}>Criar <CiCirclePlus size={20} /></button>


      <div className='container'>
        <span className='created-tasks'>Tarefas Criadas <div className='cont-tasks'>{tasks.length}</div> </span>
        <span className='concluded'>Concluidas  {select.length == 0 ? (<div className='cont-tasks'>0</div>) : (<div className='cont-select'>{select.length} de {tasks.length}</div>)}</span>

        {tasks.length === 0 ? (
          <div className='container-empty'>
            <img src={clipboard} alt='clipboard' className='clipboard' />
            <p className='text-tasks'>Você ainda não tem tarefas cadastradas</p>
            <p>Crie tarefas e organize seus itens a fazer</p>
          </div>
        ) : (
          tasks.map((item, index) => (
            <div className='container-tasks'>
              <div className='task' key={item}>
                <button className='btn-select' onClick={() => handleSelect(item.id)} > {select.find(a => a == item.id) ? (< FaCheckCircle size={20} color='#5E60CE' className='check-icon' />) : (<FaRegCircle size={20} color='#4EA8DE' className="circle-icon" />)}</button>
                <div style={{ textDecoration: select.includes(item.id) ? 'line-through' : 'none', color: select.includes(item.id) ? '#808080' : '#F2F2F2' }}>{item.tarefa}</div>
                <button className='btn-delete' onClick={() => handleDelete(item.id)}><FaRegTrashAlt size={17} color='#808080' className='svg-delete' /></button>
              </div>
            </div>
          ))

        )}


      </div>
    </div>
  )

}

export default App;
