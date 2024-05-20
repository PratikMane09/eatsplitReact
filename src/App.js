import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friend, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedfriend, setselectedfriend] = useState(null);
  function handleshowaddfriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddfriend(friend) {
    setFriend((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  //some time id not work or upload we add ? on variable
  function handleselection(friend) {
    // setselectedfriend(friend);
    setselectedfriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handlesplitbill(value) {
    console.log(value);
    setFriend((friend) =>
      friend.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setselectedfriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friendlist
          friend={friend}
          onselection={handleselection}
          selectedfriend={selectedfriend}
        />
        {showAddFriend && <FormAddFriend onaddfriend={handleAddfriend} />}
        <Button onClick={handleshowaddfriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedfriend && (
        <Formsplitbill
          selectedfriend={selectedfriend}
          onsplitbill={handlesplitbill}
          key={initialFriends.id}
        />
      )}
    </div>
  );
}

function Friendlist({ friend, onselection, selectedfriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onselection={onselection}
          selectedfriend={selectedfriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onselection, selectedfriend }) {
  const isselected = selectedfriend?.id === friend.id;
  return (
    <li className={isselected ? "selected" : ""}>
      <img src={friend.image} alt="friend.name" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even.</p>}
      <button className="button" onClick={() => onselection(friend)}>
        {isselected ? "close" : "select"}
      </button>
    </li>
  );
}

function FormAddFriend({ onaddfriend }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("");

  function handlesubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}=${id}`,
      balance: 0,
    };
    onaddfriend(newFriend);
    setname("");
    setimage("https://i.pravatar.cc/48?u=499476");
  }
  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>🙋Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />

      <label> 🌄Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />
      <Button>add</Button>
    </form>
  );
}

function Formsplitbill({ selectedfriend, onsplitbill }) {
  const [bill, setbill] = useState("");
  const [paidebyuser, setpaidbyuser] = useState("");
  const [whoispaying, setwhoispaying] = useState("user");

  const paidbyfriend = bill ? bill - paidebyuser : "";

  function handlesubmit(e) {
    e.preventDefault();

    if (!bill || !paidebyuser) return;
    onsplitbill(whoispaying === "user " ? paidbyfriend : -paidebyuser);
  }
  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>Split a bill with {selectedfriend.name}</h2>

      <label>💰bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />

      <label> 💁your expense</label>
      <input
        type="text"
        value={paidebyuser}
        onChange={(e) =>
          setpaidbyuser(
            Number(e.target.value) > bill ? paidebyuser : Number(e.target.value)
          )
        }
      />

      <label> 💁 {selectedfriend.name}'s expense</label>
      <input type="text" disabled value={paidbyfriend} />
      <label>🤑 who is paying the bill</label>
      <select
        value={whoispaying}
        onChange={(e) => setwhoispaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
