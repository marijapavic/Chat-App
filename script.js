const getRandomName = () =>{
    const animals = ["dog", "cat", "mouse", "leopard", "iguana", "raccoon", "alpaca", "chimpanzee", "rabbit", "panda", "koala", "hippopotamus", "owl", "tiger", "lion", "wolf", "bear", "elephant", "kangaroo", "rhinoceros", "camel", "horse", "meerkat", "llama", "giraffe"];
    return animals[Math.floor(Math.random() * animals.length)];
  }
  
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }
  
  const drone = new ScaleDrone("hYDZsskdJQTDVuLe", {
    data: { 
      name: getRandomName(),
      color: getRandomColor(),
    },
  });
  
  let members = [];
  
  drone.on("open", error => {
    if (error) {
      return console.error(error);
    }
    console.log("Successfully connected to Scaledrone");
  
    const room = drone.subscribe("observable-room");
    room.on("open", error => {
      if (error) {
        return console.error(error);
      }
      console.log("Successfully joined room");
    });
  
    room.on("members", m => {
      members = m;
      updateUsers();
    });
  
    room.on("member_join", member => {
      members.push(member);
      updateUsers();
    });
  
    room.on("member_leave", ({id}) => {
      const index = members.findIndex(member => member.id === id);
      members.splice(index, 1);
      updateUsers();
    });
  
    room.on("data", (text, member) => {
      if (member) {
        addMessage(text, member);
      }
    });
  });
  
  drone.on("close", event => {
    console.log("Connection was closed", event);
  });
  
  drone.on("error", error => {
    console.error(error);
  });
  
  
  
  const userList = document.querySelector(".user-list");
  const messages = document.querySelector(".chat-window");
  const message = document.querySelector(".message");
  const input = document.querySelector(".input");
  const form = document.querySelector(".form");
  
  
  form.addEventListener("submit", event => {
      event.preventDefault();
      const value = input.value;
      if (value === "") {
        return;
      }
      input.value = "";
      drone.publish({
          room: "observable-room",
          message: value,
      });
  });
  
  
  const createUser = member => {
      const { name, color } = member.clientData;
      const avatar = document.createElement("div");
      const user = document.createElement("div"); 
      user.appendChild(avatar);
      user.appendChild(document.createTextNode(name));
      user.className = "user-name";
      avatar.className = "avatar";
      avatar.style.backgroundColor = color;
      return user;
  }
  
  const updateUsers = () => {
      userList.innerHTML = "";
      members.forEach(member =>
        userList.appendChild(createUser(member))
      );
  }
  
  
  const createMessage = (text, member) =>{
    const message = document.createElement("li");
    message.appendChild(createUser(member));
    message.appendChild(document.createTextNode(text));
    message.className="message";
    return message;
  }
  
  const addMessage = (text, member) =>{
    const el = messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessage(text, member));
    if (wasTop) {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    }
     el.scrollTop = el.scrollHeight;
  }
  