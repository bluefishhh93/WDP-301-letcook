// import Comment from './Comment';
// export default async ({ params }: { params: { id: string } }) => {
//   const Comment = dynamic(() => import('./Comment'));
//   const Post = dynamic(() => import('./Post'));
//   const SideBar = dynamic(() => import('./SideBar'));
//   return (
//     <>
//       <div className="container">
//         <div className="flex flex-row">
//           <Post id={params.id}>
//             <Comment id={params.id} />
//           </Post>
//           {/* <SideBar /> */}
//         </div>
//       </div>
//     </>
//   );
// };
import Post from '../components/DemoPost';
import Comment from './Comment';
// eslint-disable-next-line react/display-name
export default async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Post id={params.id}>
        <Comment id={params.id} />
      </Post>
    </>
  );
};
