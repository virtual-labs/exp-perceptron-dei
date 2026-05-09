### Procedure

#### Step 1: Import Required Libraries
Import necessary Python libraries, including pandas for data handling, NumPy for numerical computations, and Matplotlib for visualization of the dataset and decision boundaries.

#### Step 2: Create a Dataset

Generate the OR truth table with four data points:

$$
(0,\,0) \rightarrow \text{Class } 0 \qquad (0,\,1) \rightarrow \text{Class } 1 \qquad (1,\,0) \rightarrow \text{Class } 1 \qquad (1,\,1) \rightarrow \text{Class } 1
$$

If doing for XOR, generate the XOR truth table with four data points:

$$
(0,\,0) \rightarrow \text{Class } 0 \qquad (0,\,1) \rightarrow \text{Class } 1 \qquad (1,\,0) \rightarrow \text{Class } 1 \qquad (1,\,1) \rightarrow \text{Class } 0
$$

Store this data in a pandas DataFrame for easy manipulation and visualization.

#### Step 3: Visualize the Dataset
Create a scatter plot showing the four data points with:
- **Blue dots** representing Class 0
- **Red dots** representing Class 1

This visualization shows a pattern that is linearly separable for OR.
For XOR, the diagonal pattern makes it non-linearly separable.

#### Step 4: Initialize Perceptron Parameters
Set random seed for reproducibility and initialise:
- $w_1,\, w_2$: Random weights uniformly distributed between $-1$ and $1$
- $b$: Random bias uniformly distributed between $-1$ and $1$
- $\eta$ (`learning_rate`): Set to $0.05$ (or $0.1$ in alternate version)

Print initial parameters to track how they change during training.

#### Step 5: Define Decision Boundary Plotting Function
Create a function `plot_decision_boundary(w1, w2, b)` that:
1. Calculates the decision boundary line using equation: $w_1 \cdot x_1 + w_2 \cdot x_2 + b = 0$
2. Rearranges to: $x_2 = -\,(w_1 \cdot x_1 + b)\;/\;w_2$
3. Plots this line in green on the scatter plot
4. Handles the case when $w_2 = 0$ (vertical line)

#### Step 6: Visualize Initial Random Decision Boundary
Plot the dataset along with the initial random decision boundary to show the starting position before any training occurs. This demonstrates how randomly initialized weights create an arbitrary separation.

#### Step 7: Define Perceptron Training Function
Implement `perceptron_train()` function that:

For each epoch:
1. Initialise the correct prediction counter.
2. For each data point:
   - Calculate linear output: $\text{linear\_output} = w_1 \cdot x_1 + w_2 \cdot x_2 + b$
   - Apply step activation: $y_{pred} = 1$ if $\text{linear\_output} \geq 0$ else $0$
   - Count if prediction matches actual label.
   - Calculate error: $\text{error} = y - y_{pred}$
   - Update weights: $w_1 = w_1 + \eta \times \text{error} \times x_1$
   - Update weights: $w_2 = w_2 + \eta \times \text{error} \times x_2$
   - Update bias: $b = b + \eta \times \text{error}$
3. Calculate accuracy: $\text{accuracy} = \dfrac{\text{correct}}{\text{total}} \times 100$
4. Print epoch results showing accuracy and updated parameters.
5. Visualise the decision boundary after each epoch.

Return final trained weights and bias.

#### Step 8: Run Perceptron Training
Execute the training function for 10 epochs on the dataset.

#### Step 9: Visualise Training Progress
After each epoch, generate and display a plot showing:
- The current decision boundary (green line)
- Data points (blue and red dots)
- Epoch number in the title
- Current accuracy percentage

For OR, the boundary converges to a correct solution. For XOR, the perceptron fails to converge, demonstrating the limitation of single-layer perceptron on non-linearly separable data.

#### Step 10: Make Final Predictions
Define `predict()` function and use it to make predictions on all four points using the final trained weights. Display results showing:
- Input coordinates
- Predicted class
- Actual class
- Whether the prediction is correct or incorrect

Calculate and display final accuracy on the complete dataset.

For the OR gate, the perceptron achieves $100\%$ accuracy. For the XOR gate, accuracy remains below $100\%$, confirming that a single-layer perceptron cannot solve non-linearly separable problems. This motivates the use of a Multi-Layer Perceptron (MLP) with hidden layers and backpropagation to learn non-linear decision boundaries.
