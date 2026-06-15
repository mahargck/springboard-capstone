import { NavLink } from "react-router-dom";

export default function TopicHeader({ topic, link, noHeight=false }) {
  if (topic == null) {
    return null;
  }
  const style =(noHeight) ? {minHeight:"auto"} : {minHeight: "180px" } 
  return (
    <div
      className="w3-padding-small w3-clear"
      style={{style}}>
      {(topic.logo) && (
        <img src={topic.logo} alt={topic.name} className="w3-left logo" />
      )}
      {(link) && (
        <h3>
          <NavLink className="bg-green w3-padding-small" to={topic.name.toLowerCase()}>{topic.name}</NavLink>
        </h3>
      )}
      {(topic.description) &&
        <p>{(link) ? topic.description.split("|")[0] : topic.description.replace("|", "")}</p>
      }
    </div>
  );
}