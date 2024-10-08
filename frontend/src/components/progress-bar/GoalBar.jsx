import {React, useContext} from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/default.css'
import '../../assets/css/variables.css'
import TransactionContext from "../../context/TransactionContext";

function GoalBar({ progress, balance, goal, subgoals }) {
  const hasReachedGoal = Number(balance) >= Number(goal);
  const filteredSubgoals = subgoals.slice(1, -1);
  const subgoalPositions = filteredSubgoals.map(subgoal => (Number(subgoal) / Number(goal)) * 100);
  const { currencySymbol } = useContext(TransactionContext);

  return (
    <div className="goalBarBackground">
      {/* Progress Bar */}
      <div className="goalBarContainer">
        <div
          className="goalBar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Grey Lines for Subgoals */}
      <div className="goalDivisionContainer">
        {subgoalPositions.map((position, index) => (
          <div
            key={index}
            className="goalDivider"
            style={{left: `${position}%`}}
          ></div>
        ))}
      </div>

      {/* Labels for Subgoals */}
      <div className="subGoalContainer">
        {subgoals.map((subgoal, index) => (
          <div key={index} className="text-center w-0 relative">
            <span
              className={`absolute left-1/2 transform -translate-x-1/2 text-xs 
                ${Number(balance) >= Number(subgoal) ? "text-green-700 border-green-500" : "text-gray-300 border-gray-300"} 
                border rounded px-1`}
            >
              {currencySymbol}{Number.parseFloat(subgoal).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {hasReachedGoal && (
        <div className="mt-2 w-full bg-green-100 border border-green-300 rounded-lg p-2">
          <p className="text-green-700 font-semibold">🎉 Congratulations! 🎉</p>
          <p>You have reached your goal of ${goal}.</p>
        </div>
      )}
      
    </div>
  );
}
GoalBar.propTypes = {
  progress: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  balance: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  goal: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  subgoals: PropTypes.arrayOf(
    PropTypes.any
  ).isRequired,
};

export default GoalBar;