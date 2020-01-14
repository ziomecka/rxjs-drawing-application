# User journey

## Feature: Draw on screen by moving a mouse

Background:

- given I'm a user on the home page
- and I have selected color and width
- and I move a mouse

## basic drawing

Scenario

- when I move a mouse
- then I should see the line of selected color and width being drawn

## stop drawing

Scenario

- if the line is being drawn
- when I press key 'd' or click the menu
- when I move a mouse
- then no line should be drawn

## start drawing

Scenario

- if the line is not being drawn
- when I press key 'd' or click the menu
- when I move a mouse
- then a line of selected color and width should be drawn

## change color and/or width while drawing

Scenario

- when I move a mouse and change the color and/or width from the keyboard
- then I should see a change in color and/or width
