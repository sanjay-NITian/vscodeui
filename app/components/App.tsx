import React, { useEffect, useState, useCallback } from 'react';
import { MemoryRouter as Router, Link, Switch } from 'react-router-dom';
import { routes } from '../routes/config';
import { RouteWithSubRoutes } from '../routes/RouteWithSubRoutes';
import { MessagesContext } from '../context/MessageContext';
import { CommonMessage, Message, ReloadMessage } from '../../src/view/messages/messageTypes';

export const App = () => {
  const [messagesFromExtension, setMessagesFromExtension] = useState<string[]>([]);

  const handleMessagesFromExtension = useCallback(
    (event: MessageEvent<Message>) => {
      if (event.data.type === 'COMMON') {
        const message = event.data as CommonMessage;
        setMessagesFromExtension([...messagesFromExtension, message.payload]);
      }
    },
    [messagesFromExtension]
  );

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent<Message>) => {
      handleMessagesFromExtension(event);
    });

    return () => {
      window.removeEventListener('message', handleMessagesFromExtension);
    };
  }, [handleMessagesFromExtension]);

  const handleReloadWebview = () => {
    vscode.postMessage<ReloadMessage>({
      type: 'RELOAD',
    });
  };

  const submit = async (event: any)=>{
    event.preventDefault();
    const msg = document.getElementById("input") as HTMLInputElement;
    // console.log(msg.value);
    const res = await fetch("http://localhost:8888/api/send", {
      method:"POST", body:msg.value
    });
    msg.value = '';
    // console.log(res);
  };

  return (
    <div id="outer-main">
        <header>
            <h1 id="title">
                Welcome to 314e Corp Messaging Extension
            </h1>
        </header>
        <div id="main">
            <form onSubmit={submit}>
                <input id="input" type="text"/>
                <button type="submit" id="submit" placeholder='Enter some message'> Click to Send</button>
            </form>
        </div>
    </div>
    


    // <h1>HELLO SANJAY</h1>
    // <Router
    //   initialEntries={['/', '/about', '/message', '/message/received', '/message/send']}
    // >
    //   <ul className="navbar">
    //     <li>
    //       <Link to="/">Hoome</Link>
    //     </li>
    //     <li>
    //       <Link to="/about">About</Link>
    //     </li>
    //     <li>
    //       <Link to="/message">Message</Link>
    //     </li>
    //   </ul>
    //   <button onClick={handleReloadWebview}>Reload Webview</button>

    //   <MessagesContext.Provider value={messagesFromExtension}>
    //     <Switch>
    //       {routes.map((route, i) => (
    //         <RouteWithSubRoutes key={i} {...route} />
    //       ))}
    //     </Switch>
    //   </MessagesContext.Provider>
    // </Router>
  );
};
