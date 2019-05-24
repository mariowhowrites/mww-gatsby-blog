import React, { useState } from "react"
import { CSSTransitionGroup } from "react-transition-group"

export default function SkillsSection({ skills }) {
  return (
    <section
      className={`flex flex-col bg-light-black justify-center min-h-70vh antialiased`}
    >
      <div
        className={`w-1/4 md:text-right md:ml-0 ml-7 mt-8 font-bold text-xl md:text-2xl mb-4 md:mb-0 text-gray-600`}
      >
        My Skills
      </div>
      <article
        className={`text-4xl md:text-6xl md:pr-64 md:ml-25vw ml-7 mb-8 md:pt-8 font-heading font-bold relative flex flex-col text-white font-body`}
      >
        <ul className="list-none">
          {skills.map(skill => (
            <SkillPanel skill={skill} key={skill.node.skill} />
          ))}
        </ul>
      </article>
    </section>
  )
}

function SkillPanel({ skill: skillObject }) {
  const { skill, description, color } = skillObject.node

  let [isOpen, setIsOpen] = useState(false)

  const descriptionClasses = () => {
    let classes =
      "skill-description font-normal visible mb-8 text-lg md:text-2xl w-3/4"

    return isOpen ? classes : "skill-description"
  }

  return (
    <React.Fragment>
      <li
        className="skill flex align-center cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{skill}</span>
        <div className={`carat ${isOpen ? "rotate" : ""} ml-4 text-${color}`}>
          &gt;
        </div>
      </li>
      {isOpen && (
        <CSSTransitionGroup
          transitionName="skill-description"
          transitionAppear={true}
          transitionAppearTimeout={1000}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >
          <SkillDescription
            key={skill}
            description={description}
            classes={descriptionClasses()}
          />
        </CSSTransitionGroup>
      )}
    </React.Fragment>
  )
}

function SkillDescription({ description, classes }) {
  return <div className={classes}>{description}</div>
}
