using Azure.Identity;
using GaragesAPI.Data;
using GaragesAPI.Models;
using GaragesAPI.Models.DTOs;
using GaragesAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace GaragesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            // Verifica se o usuário já existe
            if (await _context.Users.AnyAsync(u => u.Email == userRegisterDto.Email))
                return BadRequest("Nome de usuário já está em uso");

            // Cria o hash da senha
            var passwordHash = HashPassword(userRegisterDto.Password);

            var user = new User
            {
                Username = userRegisterDto.Username,
                PasswordHash = passwordHash,
                Email = userRegisterDto.Email,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Usuário Registrado com sucesso.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto, [FromServices] TokenService tokenService)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userLoginDto.Email);
            if (user == null)
                return Unauthorized("Usuário não encontrado.");

            if (!VerifyPassword(userLoginDto.Password, user.PasswordHash))
                return Unauthorized("Senha incorreta");

            var token = tokenService.GenerateToken(user);

            return Ok(new
            {
                message = "Login bem-sucedido!",
                token = token
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Pega o userId que foi gravado no token na claim NameIdentifier
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var user = await _context.Users.FindAsync(int.Parse(userId));

            if (user == null)
                return NotFound();

            return Ok(new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email
            });
        }

        // Método utilitário para criar hash da senha
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        // Método utilitário para verificar a senha
        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }

    }
}
