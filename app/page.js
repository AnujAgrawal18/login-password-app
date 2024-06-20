"use client"

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const ref = useRef()
  const imgref = useRef()
  const [passwordarray, setpasswordarray] = useState([])
  const { register, handleSubmit } = useForm();

  const savepassword = async()=>{
    let a = await fetch("http://localhost:5173/")
    // let passwords = localStorage.getItem("passwords")
    let passwords = await a.json();
    if (passwords) {
      // setpasswordarray(JSON.parse(passwords))
      setpasswordarray(passwords)
    }
  }
  useEffect(() => {
    savepassword()
  }, [])


  const onSubmit = async (val) => {
    if (val.password.length === 0 || val.username.length === 0 || val.url.length === 0) {
      toast.error('field is empty', { position: "top-right", autoClose: 2000 })
    }
    else {
      setpasswordarray([...passwordarray, { id: uuidv4(), val }])
      let a = await fetch("http://localhost:5173/",{method:"POST" , headers:{'Content-Type': 'application/json'} , body : JSON.stringify({ id: uuidv4(), val })})
      localStorage.setItem("passwords", JSON.stringify([...passwordarray, { id: uuidv4(), val }]))
      toast('Password is submitted', { position: "top-right", autoClose: 3000 })
      ref.current.reset()
    }
    console.log("Ooo")
  }
  const showpassword = () => {
    var x = document.querySelector(".pasword");
    if (imgref.current.src.includes("https://cdn-icons-png.flaticon.com/128/159/159604.png")) {
      imgref.current.src = "https://cdn-icons-png.flaticon.com/128/10812/10812267.png"
      x.type = "text";
    }
    else {
      imgref.current.src = "https://cdn-icons-png.flaticon.com/128/159/159604.png"
      x.type = "Password";
    }
  }
  const handledelete = async(e) => {
    let conf = confirm("do you want to delete the password?")
    let id = e.target.name
    let newpasswordarray = passwordarray.filter(item => item.id !== id)
    if (conf) {
      let a = await fetch("http://localhost:5173/",{method:"DELETE" , headers:{'Content-Type': 'application/json'} , body : JSON.stringify({ id: id})})
      localStorage.setItem("passwords", JSON.stringify(newpasswordarray))
      setpasswordarray(newpasswordarray)
    }


  }
  const handleedit = async(e) => {
    let text = prompt("Please enter new password");
    let id = e.target.name;
    let index = passwordarray.findIndex(item => {
      return item.id === id
    })
    let newpasswordarray = [...passwordarray]
    newpasswordarray[index].val.password = text
    let arr = newpasswordarray[index].val
    let a = await fetch("http://localhost:5173/",{method:"DELETE" , headers:{'Content-Type': 'application/json'} , body : JSON.stringify({ id: id})})
    let b = await fetch("http://localhost:5173/",{method:"POST" , headers:{'Content-Type': 'application/json'} , body : JSON.stringify({ id, arr})})
    localStorage.setItem("passwords", JSON.stringify(newpasswordarray))
    setpasswordarray(newpasswordarray)
  }

  const copytext = (text) => { navigator.clipboard.writeText(text) }


  return (<>
    <ToastContainer position="top-right" autoClose={3000} />
    <div className="text-center w-[100vw]">
      <div className=" text-[40px] px-10 font-bold ">MY-PASSMAN</div>
      <div className="text-[20px]">my own password manager</div>
      <form className="mx-auto w-7/12 my-5" onSubmit={handleSubmit(onSubmit)} ref={ref} action="./api/data" method="post">
        <input {...register("url")} className="w-[95%] h-[40px] m-[15px] rounded-[20px] border-[2px] border-green-600 px-7" type="text" placeholder="Enter Website URL" />
        <div className="flex align-middle justify-center">
          <input className=" w-[66%] h-[40px] my-[15px] mx-[10px] rounded-[20px] border-[2px] border-green-600 px-7" type="text" placeholder="Enter Username" {...register("username")} />
          <div className="relative flex">
            <input className="pasword w-[100%] h-[40px] my-[15px] rounded-[20px] border-[2px] border-green-600 px-7" type="password" placeholder="Enter Password" {...register("password")} />
            <img ref={imgref} src="https://cdn-icons-png.flaticon.com/128/159/159604.png" alt="" onClick={showpassword} className="w-[20px] h-[20px] absolute top-6 right-3" />
          </div></div>
        <div className="text-center"><button className="w-[25%] h-[40px] m-[15px] rounded-[20px] bg-green-800 text-white" type="submit">Save </button></div>
      </form>
      <div className="text-[20px] font-bold">Your Passwords</div>
      {passwordarray.length == 0 && <div> NO PASSWORDS TO SHOW</div>}
      {passwordarray.length != 0 &&
        <div className="container w-[50vw] my-[15px] text-center mx-auto ">
          <div className="w-[100%] h-[40px] bg-green-900 text-white flex py-1">
            <p className="w-[40%]">Site Name </p>
            <p className="w-[20%]">Username</p>
            <p className="w-[20%]">Password</p>
            <p className="w-[20%]">Actions</p>
          </div>
          {
            passwordarray.map(item => {
              return (<div className="card w-[100%] h-[40px] bg-green-300 flex py-1 border-[2px] border-white text-center" key={item.id}>
                <div className="w-[40%] flex justify-center text-wrap" >{item.val.url}<video className="w-[20px] mx-5" onClick={() => { copytext(item.val.url) }} src="https://cdn-icons-mp4.flaticon.com/512/8948/8948314.mp4" onMouseOver={event => event.target.play()} /></div>
                <div className="w-[20%] flex justify-center text-wrap">{item.val.username}<video className="w-[20px] mx-5" onClick={() => { copytext(item.val.username) }} src="https://cdn-icons-mp4.flaticon.com/512/8948/8948314.mp4" onMouseOver={event => event.target.play()} /></div>
                <div className="w-[20%] flex justify-center text-wrap">{item.val.password}<video className="w-[20px] mx-5" onClick={() => { copytext(item.val.password) }} src="https://cdn-icons-mp4.flaticon.com/512/8948/8948314.mp4" onMouseOver={event => event.target.play()} /></div>
                <div className="w-[20%] flex text-center justify-center text-wrap">
                  <div className="w-[30px] mx-5"><img src="https://cdn-icons-png.flaticon.com/128/2356/2356780.png" alt="" onClick={handleedit} name={item.id} /></div>
                  <div className="w-[30px] mx-5" ><img src="https://cdn-icons-png.flaticon.com/128/3405/3405244.png" alt="" onClick={handledelete} name={item.id} /></div>
                </div>
              </div>)
            })
          }

        </div>}
    </div></>
  )
}
