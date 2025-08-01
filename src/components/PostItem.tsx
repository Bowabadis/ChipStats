import { useEffect, useRef, useState } from "react";
import type { Post } from "../pages/ViewPosts"
import { supabase } from "../supabase-client";
import { Link } from "react-router";
import { BiDotsVerticalRounded } from "react-icons/bi";


interface Props {
  isSelf: boolean;
  deletePost: () => void;
  post: Post;
}

function getProfitMessage(buyIn: number, buyOut: number) {
  let colorClass = "text-black"; // default

  if (buyOut - buyIn > 0) {
    colorClass = "text-green-700";
    if (buyOut / buyIn > 1.5) colorClass = "text-green-600";
    if (buyOut / buyIn > 2) colorClass = "text-green-500";
    return <span>made <span className={`font-bold ${colorClass}`}>${Math.abs(buyOut - buyIn).toFixed(2)}</span> from a <span className="font-medium">${buyIn.toFixed(2)}</span> buy in</span>
  } else if (buyOut - buyIn < 0) {
    colorClass = "text-red-700";
    if (buyIn / buyOut > 1.5) colorClass = "text-red-600";
    if (buyIn / buyOut > 2) colorClass = "text-red-500";
    return <span>lost <span className={`font-bold ${colorClass}`}>${Math.abs(buyOut - buyIn).toFixed(2)}</span> from a <span className="font-medium">${buyIn.toFixed(2)}</span> buy in</span>
  }


  return <span>came out even off a <span className="font-medium">${buyIn.toFixed(2)}</span> buy in</span>
}

function formatDate(date_string: Date): string {
  const date = new Date(date_string);

  let hour = date.getHours();
  const minute = date.getMinutes();
  let timeOfDay = 'AM';
  if (hour >= 12) {
    timeOfDay = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  }
  const time = `${hour.toString()}:${minute.toString().padStart(2, '0')}`;

  if (new Date(Date.now()).toDateString() === date.toDateString()) {
    //same day
    return `Today at ${time} ${timeOfDay}`
  } else if (new Date(Date.now() - 86400000).toDateString() === date.toDateString()) {
    //yesterday
    return `Yesterday at ${time} ${timeOfDay}`
  } else {
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${month} ${day}, ${year} at ${time} ${timeOfDay}`; // Example: YYYY-MM-DD

    return formattedDate
  }
}

function DisplayName({ user_id }: { user_id: string }) {
  const [name, setName] = useState('User');

  useEffect(() => {
    async function fetchName() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user_id)
          .single();

        if (error) throw error;
        setName(data?.first_name + ' ' + data?.last_name || 'Anonymous');
      } catch (err) {
        console.error(err);
        setName('Anonymous');
      }
    }

    fetchName();
  }, [user_id]);

  return <span>{name}</span>;
}


function PostItem({ post, isSelf, deletePost }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  function PostOptions() {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setShowOptions(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div ref={menuRef} className="absolute right-0 mt-2 w-40 bg-bg-main border border-border shadow-lg rounded z-50">
        <ul className="text-sm text-text">
          <li className="px-4 py-2 hover:bg-gray-100 text-red-500 font-bold cursor-pointer"
            onClick={deletePost}>
              Delete
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div className="relative text-text p-2 rounded-lg border border-border shadow w-full overflow-visible">
      {isSelf && (
        <div ref={buttonRef} className="absolute top-2 right-2">        
          <BiDotsVerticalRounded onClick={() => setShowOptions(!showOptions)} />

          {showOptions && (
            <PostOptions />
          )}
        </div>
      )}
      <div className="text-lg">
        <span className="font-bold"><Link to={`/profile/${post.user_id}`}><DisplayName user_id={post.user_id} /></Link></span> {getProfitMessage(post.buy_in, post.buy_out)}
      </div>
      <div className=" flex justify-between">
        <span className="font-extralight text-text-muted text-sm">{formatDate(post.date)}</span>
      </div>
      <div className="font-light text-lg pt-2">{post.content}</div>
    </div>
  )
}

export default PostItem