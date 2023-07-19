import numpy as np
from operator import add
import copy


# Gameboard Class.  Handles all movement on gameboard.
class Gameboard:
    def __init__(self):
        self.status = [[0] * 8 for _ in range(8)]
        self.player = "White"
        self.player2 = "Black"
        self.columns = {
            "a": 0,
            "Black": 1,
            "c": 2,
            "d": 3,
            "e": 4,
            "f": 5,
            "g": 6,
            "h": 7,
        }
        self.wking = None
        self.bking = None

    # Translates chess coordinates into list coordinates
    def translate(self, move):
        row = int(move[1]) - 1
        column = self.columns[move[0]]
        return [row, column]

    # Returns a piece at a given position
    def get_piece(self, position):
        return self.status[position[0]][position[1]]

        # Returns a nested list of the board state across a all atrributes of the pieces on the board.

    def slice_all(self):
        attribute_list = [
            [
                copy.deepcopy(x.__dict__) if not isinstance(x, int) else x
                for x in sublist
            ]
            for sublist in self.status
        ]
        for x in attribute_list:
            for j in x:
                if j != 0:
                    del j["board"]

        return attribute_list

    # Returns a nested list of the board state across a certain atrribut of the pieces on the board.
    def slice(self, attribute):
        return [
            [getattr(x, attribute) if not isinstance(x, int) else x for x in sublist]
            for sublist in self.status
        ]

    # Restarts/initializes the game
    def reset(self):
        for cls in Chesspiece.__subclasses__():
            dum = cls()
            i = 0
            for x, y in dum.startpositions:
                p = cls(id=i, player="White", position=[x, y], board=self)
                self.status[x][y] = p
                p.valid_moves_calc()
                if dum.name == "King":
                    y += 1
                if dum.name == "Queen":
                    y -= 1
                print(dum.__class__)
                p2 = cls(id=-i, player="Black", position=[7 - x, 7 - y], board=self)
                self.status[-(x + 1)][-(y + 1)] = p2
                p2.valid_moves_calc()
                i += 1
            self.wking = self.status[0][3]
            self.bking = self.status[7][3]
        self.valid_moves_all()

    # calculate valid moves
    def valid_moves_all(self):
        for i in self.status:
            for j in i:
                if j != 0:
                    j.valid_moves_calc()

    # Renders the board state
    def render(self, attribute):
        row = 8

        print("   ", end="")
        print(list(self.columns.keys())[0], end="")
        for i in range(1, 8):
            print("--" + list(self.columns.keys())[i], end="")
        print("")

        for i in self.slice(attribute)[::-1]:
            print(row, end=" ")

            for j in i:
                if j == 0:
                    j = "  "
                print("|" + str(j), end="")
            print("|", end="")
            print(" " + str(row), end=" ")
            print()
            row -= 1

        print("   ", end="")
        print(list(self.columns.keys())[0], end="")
        for i in range(1, 8):
            print("--" + list(self.columns.keys())[i], end="")
        print("")

    def check_first_move(self, move):
        start = self.translate(move.split(","))
        start = list(map(int, start))
        piece = self.status[start[0]][start[1]]

        if piece == 0:
            return {"error": "not a chesspiece!"}

        if piece.player != self.player:
            return {"error": "Not your piece!"}
        return True

    # Takes user input for a move, tests inputs for basic sanity then runs check_move() to see if move is valid
    def make_a_move(self, start, end):
        piece = self.status[start[0]][start[1]]
        endPiece = self.status[end[0]][end[1]]
        if piece != 0:
            if end in piece.valid_moves:
                self.status[start[0]][start[1]] = 0
                self.status[end[0]][end[1]] = piece
                piece.position = end
                if self.test_check() == True:
                    self.status[start[0]][start[1]] = piece
                    self.status[end[0]][end[1]] = endPiece
                    piece.position = start
                    self.valid_moves_all()
                    return False
                piece.move_history.append(start)
                """ @TODO: find a better way to swap platers and set valid moves """
                self.player_swap()
                self.valid_moves_all()
                return True
            else:
                return False

    def valid_moves(self, input):
        piece = self.status[input[0]][input[1]]
        valid_moves = []
        if self.player == piece.player:
            for i in piece.moves():
                for move in i:
                    end = list(map(add, input, move))
                    """ TODO Clean this up """
                    if self.check_move(input, end) == True:
                        valid_moves.append(end)
        return valid_moves

    # checks if move is valid
    def check_move(self, start, end):
        piece = self.status[start[0]][start[1]]
        where = list(np.array(end) - np.array(start))
        if end[0] < 0 or end[0] >= 8 or end[1] < 0 or end[1] >= 8:
            return "Off the board"
        try:
            if (
                self.status[end[0]][end[1]].player
                == self.status[start[0]][start[1]].player
            ):
                return "can't eat your piece!"
        except:
            pass
        for element in piece.moves():
            if where in element:
                track = [x[element.index(where)] for x in piece.moves()]
                for i in track[1 : track.index(where)]:
                    path = list(np.array(start) + np.array(i))
                    if self.status[path[0]][path[1]] != 0:
                        return "Move blocked by other Piece!"
                return True
        return "Not a Valid Move!"

    # Checks if current player is in check
    def test_check(self):
        return_val = False
        piecelist = [
            x
            for element in self.status
            for x in element
            if (x != 0 and x.player != self.player)
        ]
        if self.player == "White":
            king = self.wking
        else:
            king = self.bking

        self.player_swap()
        self.valid_moves_all()
        for x in piecelist:
            if king.position in x.valid_moves:
                return_val = True

        self.player_swap()
        self.valid_moves_all()
        return return_val

    def player_swap(self):
        if self.player == "White":
            self.player = "Black"
            self.player2 = "White"
        else:
            self.player = "White"
            self.player2 = "Black"

    # Tests to see if current player is in checkmate
    def test_checkmate(self):
        piecelist = [
            x
            for element in self.status
            for x in element
            if (x != 0 and x.player == self.player)
        ]
        for piece in piecelist:
            start = [piece.position[0], piece.position[1]]
            for end in piece.valid_moves:
                endPiece = self.status[end[0]][end[1]]

                """ Make a move ans test for check """
                if end in piece.valid_moves:
                    self.status[start[0]][start[1]] = 0
                    self.status[end[0]][end[1]] = piece
                    piece.position = end
                    self.valid_moves_all()
                    if self.test_check() != True:
                        """not in checkmate"""
                        self.status[start[0]][start[1]] = piece
                        self.status[end[0]][end[1]] = endPiece
                        piece.position = start
                        self.valid_moves_all()
                        return False

                    """ revert board status """
                    self.status[start[0]][start[1]] = piece
                    self.status[end[0]][end[1]] = endPiece
                    piece.position = start
                    self.valid_moves_all()

        return True


# Chess Pieces
class Chesspiece:
    def __init__(self, id=0, player="White", position=[0, 0], board=Gameboard()):
        self.base_moves = []
        self.player = player
        self.id = id
        self.name = self.__class__.__name__
        self.move_history = []
        self.position = position
        self.board = board
        self.valid_moves = []

    def moves(self):
        return [(np.array(self.base_moves) * n).tolist() for n in range(9)]

    def valid_moves_calc(self):
        self.valid_moves = self.board.valid_moves(self.position)


class Pawn(Chesspiece):
    def __init__(self, id=0, position=[0, 0], player="White", board=Gameboard()):
        super().__init__(id, player, position, board)
        self.startpositions = [(1, x) for x in range(8)]
        self.base_moves = []
        self.shortname = self.player + "p"
        self.symbol = "♙" if self.player == "White" else "♟"

    """ TODO: Make this less insane """

    def moves(self):
        moves = []
        moves2 = []
        if self.player == "White":
            moves2.append([1, 0])
            if self.move_history == []:
                moves2.append([2, 0])
        else:
            moves2.append([-1, 0])
            if self.move_history == []:
                moves2.append([-2, 0])

        for i in (1, -1):
            if self.player == "White":
                try:
                    if self.board.status[self.position[0] + 1][self.position[1] + i]:
                        moves2.append([1, i])
                except:
                    continue
            else:
                try:
                    if self.board.status[self.position[0] - 1][self.position[1] + i]:
                        moves2.append([-1, i])
                except:
                    continue

        if self.player == "White":
            try:
                if self.board.status[self.position[0] + 1][self.position[1]]:
                    moves2.remove([1, 0])
                    moves2.remove([2, 0])
                if self.board.status[self.position[0] + 2][self.position[1]]:
                    moves2.remove([2, 0])
            except:
                pass
        else:
            try:
                if self.board.status[self.position[0] - 1][self.position[1]]:
                    moves2.remove([-1, 0])
                    moves2.remove([-2, 0])
                if self.board.status[self.position[0] - 1][self.position[1]]:
                    moves2.remove([-2, 0])
            except:
                pass

        moves.append(moves2)
        return moves


class Rooke(Chesspiece):
    def __init__(self, id=0, position=[0, 0], player="White", board=Gameboard()):
        super().__init__(id, player, position, board)
        self.startpositions = [(0, 0), (0, 7)]
        self.base_moves = [(1, 0), (0, 1), (-1, 0), (0, -1)]
        self.shortname = self.player + "r"
        self.symbol = "♖" if self.player == "White" else "♜"


class Bishop(Chesspiece):
    def __init__(self, id=0, position=[0, 0], player="White", board=Gameboard()):
        super().__init__(id, player, position, board)
        self.startpositions = [(0, 2), (0, 5)]
        self.base_moves = [(1, 1), (-1, -1), (-1, 1), (1, -1)]
        self.shortname = self.player + "Black"
        self.symbol = "♗" if self.player == "White" else "♝"


class Knight(Chesspiece):
    def __init__(self, id=0, position=[0, 0], player="White", board=Gameboard()):
        super().__init__(id, player, position, board)
        self.startpositions = [(0, 1), (0, 6)]
        self.base_moves = [
            [[2, 1], [2, -1], [1, 2], [1, -2], [-2, 1], [-2, -1], [-1, 2], [-1, -2]]
        ]

        self.shortname = self.player + "k"
        self.symbol = "♘" if self.player == "White" else "♞"

    def moves(self):
        return self.base_moves


class King(Chesspiece):
    def __init__(self, id=0, position=[0, 0], player="White", board=Gameboard()):
        super().__init__(id, player, position, board)
        self.startpositions = [(0, 3)]
        self.base_moves = [
            [
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [1, 1],
                [-1, -1],
                [-1, 1],
                [1, -1],
            ]
        ]
        self.shortname = self.player + "K"
        self.symbol = "♔" if self.player == "White" else "♚"
        self.name = "King"

    def moves(self):
        return self.base_moves


class Queen(Chesspiece):
    def __init__(self, id=0, position=[0, 0], player="White", board=Gameboard()):
        super().__init__(id, player, position, board)
        self.base_moves = [
            (1, 0),
            (0, 1),
            (-1, 0),
            (0, -1),
            (1, 1),
            (-1, -1),
            (-1, 1),
            (1, -1),
        ]
        self.startpositions = [(0, 4)]
        self.shortname = self.player + "Q"
        self.symbol = "♕" if self.player == "White" else "♛"
        self.name = "Queen"
