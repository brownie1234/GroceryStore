import React,{useEffect, useState} from 'react'
import axios from 'axios'

export default function Main() {

  const [items, setItems] = useState([])
  const [addItemModal, setAddItemModal] = useState(false)
  const [createItem, setCreateItem] = useState([{name: '', description: '', image: ''}])
  const [search, setSearch] = useState('');
  const [editItemData, setEditItemData] = useState([{name: '', description: '', image: ''}])
  const [editItemModal, setEditItemModal] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3001/getAllItems')
      .then(res => {console.log(res.data);setItems(res.data)})
      .catch(err => console.log(err))
  },[])
  async function addItem(name, description, image) {
    await axios.post('http://localhost:3001/addItem', {
      name: name,
      description: description,
      image: image
    }).then(res =>{
        if(res.data.success) {
          setItems([...items, {name: name, description: description, image: image}])
        }
      }
    )
    setAddItemModal(false);
    setCreateItem({name: '', description: '', image: ''})
  }
  async function deleteItem(id) {
    await axios.post('http://localhost:3001/deleteItem', {
      id: id
    }).then(res =>{
        if(res.data.success) {
          setItems(items.filter(item => item.id !== id))
        }
      }
    )
  }
  async function editItem(id, name, description, image) {
    console.log(description)
    axios.post('http://localhost:3001/editItem', {
      id: id,
      name: name,
      description: description,
      image: image
    }).then(res =>{
        if(res.data.success) {
          setItems(items.map(item => {
            if(item.id === id) {
              item.name = name;
              item.description = description;
              item.image = image;
            }
            return item;
          }))
        }
      }
    )
    setEditItemModal(false);
  }
  return (
    <div className='landing'>
      <h1>Whole Foods but BETTER!</h1>
      <input type='text' onChange={(e)=>setSearch(e.target.value)} className="search-bar" placeholder='Search' />
      <button className='add-item' onClick={() => setAddItemModal(true)}>Add Item</button>
      <div className='items-list'>
        {
          items.map(item => {
            if (search){
              if(item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()))
              return (
                <div className='item' key={item.id}>
                  <img className="item-image" src={item.image} alt={item.name} />
                  <div className='item-info'>
                    <h3>{item.name}</h3>
                    <h5>{item.id}</h5>
                    <p>{item.description}</p>
                  </div>
                  <div className='item-buttons'>
                    <button className='edit-item' onClick={() => { setEditItemData({ id: item.id, name: item.name, description: item.description, image: item.image }); setEditItemModal(true) }}>Edit</button>
                    <button className='delete-item' onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </div>
              )
            }
            else {
              return (
                <div className='item' key={item.id}>
                  <img className="item-image" src={item.image} alt={item.name} />
                  <div className='item-info'>
                    <h3>{item.name}</h3>
                    <h5>{item.id}</h5>
                    <p>{item.description}</p>
                  </div>
                  <div className='item-buttons'>
                    <button className='edit-item' onClick={() => { setEditItemData({ id: item.id, name: item.name, description: item.description, image: item.image }); setEditItemModal(true) }}>Edit</button>
                    <button className='delete-item' onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
      {addItemModal && <div className='add-item-modal'>
        <div className='add-item-modal-content'>
          <h2>Add Item</h2>
          <form>
            <input type='text' onChange={(e)=>setCreateItem(prev=>({...prev, name:e.target.value}))} value={createItem.name} placeholder='Name' />
            <input type='text' onChange={(e)=>setCreateItem(prev=>({...prev, description:e.target.value}))} value={createItem.description} placeholder='Description' />
            <input type='text' onChange={(e)=>setCreateItem(prev=>({...prev, image:e.target.value}))} value={createItem.image} placeholder='Image URL' />
            <div>
              <button type="button" onClick={()=>addItem(createItem.name, createItem.description, createItem.image)}>Add</button>
            </div>
          </form>
        </div> 
      </div>}
      {editItemModal && <div className='edit-item-modal'>
        <div className='edit-item-modal-content'>
          <h2>Edit Item</h2>
          <form>
            <input type='text' onChange={(e)=>setEditItemData(prev=>({...prev, name:e.target.value}))} value={editItemData.name} placeholder='Name' />
            <input type='text' onChange={(e)=>setEditItemData(prev=>({...prev, description:e.target.value}))} value={editItemData.description} placeholder='Description' />
            <input type='text' onChange={(e)=>setEditItemData(prev=>({...prev, image:e.target.value}))} value={editItemData.image} placeholder='Image URL' />
            <div>
              <button type="button" onClick={()=>editItem(editItemData.id, editItemData.name, editItemData.description, editItemData.image)}>Update</button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  )
}
