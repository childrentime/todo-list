import React from 'react';
import './app.css'
import {MyItem} from "./MyItem";


interface MyState {
    todoItems: MyItem[]
}
/*any是prop的类型  MyState是state的类型*/
export default class App extends React.Component<{},MyState >{

    private readonly inputRef: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        /*this.refs已经过时*/
        this.inputRef = React.createRef();
        this.state = {
            /*如果为空 需要赋值空数组*/
            todoItems: JSON.parse(localStorage.getItem("todo") as string) || []
        }
    }

    addTodoItem = (e: React.KeyboardEvent)=>{
        /*回车事件 key code已经废弃*/
        if(e.key === 'Enter'){
            const newTodoItem = {
                id: this.state.todoItems.length,
                // @ts-ignore
                value: this.inputRef.current.value,
                delete: false,
                finish: false
            };
            this.setState({
                todoItems: [...this.state.todoItems,newTodoItem]
            });
            /*这个时候todoItems还没有刷新*/
            console.log(...this.state.todoItems);
            localStorage.setItem("todo",JSON.stringify([...this.state.todoItems,newTodoItem]));
            // @ts-ignore
            this.inputRef.current.value = '';
        }
    };

    deleteTodoItem = (item: MyItem)=>{
        item.delete = true;
        /*刷新页面*/
        this.setState({
            todoItems: [...this.state.todoItems]
        });
        localStorage.setItem("todo",JSON.stringify(this.state.todoItems));
    };

    updateTodoItem = (item: MyItem)=>{
        item.finish = !item.finish;
        /*刷新页面*/
        console.log(this.state.todoItems)
        this.setState({
            todoItems: [...this.state.todoItems]
        });
        localStorage.setItem("todo",JSON.stringify(this.state.todoItems));
    };

    changeTodoItem = (value: React.ChangeEvent<HTMLInputElement>,item: MyItem)=>{
        item.value  = value.target.value;
        this.setState({
            todoItems: [...this.state.todoItems]
        });
        localStorage.setItem("todo",JSON.stringify(this.state.todoItems));
    }

    render() {
        return (
            <div className="container">
                <h1 className="header">TS Todo</h1>
                <input ref={this.inputRef} onKeyDown={this.addTodoItem} className="subHeader" type="text" placeholder="What needs to be done?"/>
                <ul>
                    {
                        this.state.todoItems.map(item=>{
                            if(item.delete) return <></>;
                            return (
                                <li key={item.id}>
                                    <label >
                                        <img onClick={()=>{this.updateTodoItem(item)}} className="leftImage" src={item.finish === true?"../assets/images/finish_blue.png":"../assets/images/finish_black.png" } alt=""/>
                                        <input value={item.value} className={item.finish === true?"deleteLine":""} type="text" onChange={(value)=>{this.changeTodoItem(value,item)}}/>
                                        {/*绑定删除事件 需要使用匿名函数*/}
                                        <img onClick={()=>{this.deleteTodoItem(item)}} className="rightImage" src="../assets/images/delete.png" alt=""/>
                                    </label>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}