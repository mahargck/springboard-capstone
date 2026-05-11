import imgG from '../images/sk-g.png'
import imgJ from '../images/sk-j.png'
import imgS from '../images/sk-s.png'

export default function About() {
  return (
    <>
      <h2>About</h2>
      <p>
        <b>Homesteader's Notebook</b> started out as a simple project to help my wife organize her homesteading notes.
      </p>
      <p>
        in 2022, we started our homesteading journey with a small backyard in the suburbs. We had a lot of questions about what animals and plants would work best for our current setup, and found my wife taking notes from various sources filling several notebooks.  Over time, we realized that there was a lot of information that we had collected that could be useful to others, and that it would be easier to organize and access if it was all in one place. So, I decided to create a web application to help organize and share our homesteading notes.
      </p>
      <p>
        We hope that the content that has been collected may be of use to others looking to learn more about homesteading and choosing either animals or plants which will work best for you.

        If you have any questions, suggestions, or would like to contribute to the project, please feel free to reach out to us. We are always looking for ways to improve the application and make it more useful for our users.
      </p>
      <h3>Staff</h3>
      <div className="w3-row">
        <div className="w3-col m4">
        {/* <span class="material-symbols-outlined w3-left" style={{fontSize:"72px"}}>face</span> */}
          <img src={imgG} class="w3-left" style={{width:"96px"}}/>
          Mr. G <br />
          Head of Design and Implimentation
        </div>
        <div className="w3-col m4">
        {/* <span class="material-symbols-outlined w3-left" style={{fontSize:"72px"}}>face_3</span> */}
          <img src={imgJ} class="w3-left" style={{width:"96px"}}/>
          Mrs. J <br />
          Head of Research
        </div>
        <div className="w3-col m4">
        {/* <span class="material-symbols-outlined w3-left" style={{fontSize:"72px"}}>face_5</span> */}
          <img src={imgS} class="w3-left" style={{width:"96px"}}/>
          S <br />
          Head of Artistic Image Creation
        </div>
      </div>
    </>
  );
}