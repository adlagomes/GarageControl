using System.Text.Json.Serialization;
using GaragesAPI.Data;
using Microsoft.EntityFrameworkCore;
using GaragesAPI.Profiles;

var builder = WebApplication.CreateBuilder(args);

// configurando cors
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
options.AddPolicy(name: MyAllowSpecificOrigins,
                  policy =>
                  {
                      policy.WithOrigins("http://localhost:4200")
                            .AllowAnyHeader()
                            .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                            .WithExposedHeaders("X-Pagination");
                  });
       
});

// Configuração de AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add services to the container.

builder.Services.AddControllers() // essa adição será retirada quando implementar DTOs
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.WriteIndented = true;
        });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura DbContext com SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")
));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles(); // Habilita o serviço de arquivos estáticos (para wwwroot)

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
