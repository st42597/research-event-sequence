cnt = 0
alpha = ['*', 'A', 'B', 'C', 'D', 'E']
ans = [['x', 'x', 'x'] for _ in range(10)]

EVENT_TYPE_NUM = 2
R, C = 3, 2


def f(x, y):
    global cnt
    if y  >= C:
        y = 0
        x += 1

    if x >= R:
        for i in range(R):
            for j in range(C):
                file.write(ans[i][j])
            file.write('\n')
        file.write('\n')
        cnt += 1
        return

    for i in range(EVENT_TYPE_NUM + 1):
        ans[x][y] = alpha[i]
        f(x, y + 1)

file = open('./output.txt', 'w')
f(0, 0)
file.write(f'number of cases: {cnt}')
file.close()