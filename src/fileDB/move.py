# from pathlib import Path

# # https://stackoverflow.com/questions/2491222/how-to-rename-a-file-using-python

# p = Path('../fileDB/mock.txt')
# # p.rename(Path(p.parent, f"{p.stem}_1_{p.suffix}"))
# print(Path(p.parent, f"{p.stem}_1_{p.suffix}"))
# --
import shutil

# shutil.move('../httpClient/mock.txt', '../httpClient/mm.txt')
shutil.move('../httpClient/mm.txt', '../httpClient/mock.txt')
