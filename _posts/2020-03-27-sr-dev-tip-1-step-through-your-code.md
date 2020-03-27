---
title: Sr. Dev Tip 1: Step through your code
tags: [Node.js, tips]
author: prust
---
I believe that if you want to be on a track to becoming a [senior developer](https://softwareengineering.stackexchange.com/questions/14914/whats-the-difference-between-entry-level-jr-sr-developers), the first habit you should adopt is the use of the interactive debugger. It pains me to see developers default to print debugging and to only reach for the interactive debugger as a last resort, if at all.

# Step through all newly-written code

Every developer should self-review their own code and the most thorough way to review code is to step through it. This habit has been instrumental in my own growth as a programmer and I believe it will be instrumental in helping other developers on their journey towards becoming an intermediate or senior developer.

Many developers will bristle at this suggestion, but the truth is:

1. Almost all newly-written code has bugs, no matter how good you are
2. The most efficient way to find and fix these bugs is by stepping through the code in an interactive debugger

Sometimes it *feels* more efficient to just run the code and wait for an error to be thrown or for erroneous behavior to present itself. After all, that is the quickest way to see what errors will be generated. But stepping through new code is a more efficient way to find and fix the source of the errors because it often:

* helps you see the root issue more quickly (errors that are thrown are often symptoms, but not the root cause)
* helps you see multiple issues at a time
* helps you see other issues and edge cases that were not directly encountered in the first run

I will readily admit that sometimes — perhaps the majority of the time — you will run the code, see an error message, and know immediately what the root issue is. But the real problem is the tricky bugs, the 20% of the bugs that take 80% of your time. Unfortunately, it's usually not obvious at first whether the bug you are facing is in this category. If you habitually use the interactive debugger, you will find these tricky bugs much faster and your overall development time will be reduced.

There is another benefit to stepping through new code, but it is more of a long-term advantage. The repetition of "helps you see" in the 3 bullet points above is not accidental: the interactive debugger gives you an incisive view into your program, allowing you to see the data as it flows through your code. This reinforces your mental model of the code and the data, which is perhaps even more valuable than quickly fixing the immediate issues.

# The Interactive Debugger should be your first tool of choice

Most developers know from experience that print debugging (also known as "printf debugging" or "console debugging") can be hit-or-miss. Sometimes you are able to guess the right values to print at the right times. But often it takes two or three passes in order to zero in on the problem.

Interactive debugging requires a little more up-front setup (in Node you have to pass `--inspect-brk`, open Chrome to `chrome://inspect`, and click the "inspect" link), but if you do use it habitually, it takes 10 or 15 seconds the first time and much less subsequent times.

In return for this up-front investment, you can hover over any variable to see what it is, you can put variables in the watch window for easier access, you can watch more variables at runtime, you can see exactly which branches are being taken, you can set breakpoints and conditional breakpoints, etc.

I think the main reluctance is due to the up-front work involved and the natural misplaced optimism that "I won't need it this time". Like gambling, occasional quick wins can reinforce the idea that working off of error messages and print statements is all you need, and that the debugger is overkill. But I have found that the habit of stepping through new code and turning to the debugger as the first tool of choice is well worth the effort.

Steve Maguire, who was involved in Microsoft's efforts to get bug counts down to manageable levels after having to cancel a product due to a runaway bug list, writes this in [Writing Solid Code](http://writingsolidcode.com):

> I don't know many programmers who consistently write bug-free code, but the few I do know habitually step through all of their code.

If you are hungry for more career advice, the best book I've found to help junior developers on their journey to becoming intermediate developers is [The Pragmatic Programmer](https://pragprog.com/book/tpp20/the-pragmatic-programmer-20th-anniversary-edition), and the best book I've found to help intermediate developers become senior developers is [Writing Solid Code](http://writingsolidcode.com), which has an excellent chapter on stepping through your code.